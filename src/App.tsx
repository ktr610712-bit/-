/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PRODUCT_DATA, INITIAL_INQUIRIES } from './data';
import { Product, Category, Inquiry } from './types';
import { resolveAssetPath } from './utils';
import { 
  CHEMICAL_RESISTANCE_DATA, 
  UN_KID_SPEC_DATA, 
  CAUTION_DATA 
} from './catalogueData';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import ProductCard from './components/ProductCard';
import CompanyIntro from './components/CompanyIntro';
import ProductSpecsList from './components/ProductSpecsList';
import ConsultationForm from './components/ConsultationForm';
import Footer from './components/Footer';

import { ChevronLeft, ChevronRight, Plus, X, Lock, ShieldCheck, Edit, Trash2, BookOpen, AlertTriangle, Eye, CheckCircle2, XCircle, Info, Settings, RefreshCw, Upload } from 'lucide-react';

export default function App() {
  // Navigation & Page Tabs
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem('UW_IS_ADMIN');
    return saved === null ? false : saved === 'true';
  });

  // Admin Login Modal States
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginId, setLoginId] = useState<string>('');
  const [loginPw, setLoginPw] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Custom Editable Badge on Hero banner
  const [heroBadgeText, setHeroBadgeText] = useState<string>(() => {
    return localStorage.getItem('UW_HERO_BADGE') || 'PE 고강도 보강밴드형 케미칼탱크';
  });
  const [showBadgeEditModal, setShowBadgeEditModal] = useState<boolean>(false);
  const [badgeEditTemp, setBadgeEditTemp] = useState<string>('');

  // Custom Editable Main Image on Hero banner
  const [heroImageUrl, setHeroImageUrl] = useState<string>(() => {
    const saved = localStorage.getItem('UW_HERO_IMAGE');
    const validHeroSet = new Set([
      '/assets/images/regenerated_image_1781685239299.png',
      '/assets/images/regenerated_image_1781685912943.png',
      '/assets/images/regenerated_image_1781685907524.png',
      '/assets/images/regenerated_image_1781688139818.png',
      '/assets/images/regenerated_image_1781688142077.png',
      '/assets/images/uploaded_tank_1_1781683205180.jpg',
      '/assets/images/un120_white_tank_1783489320557.jpg',
      '/assets/images/uploaded_tank_2_1781683222315.jpg',
      '/assets/images/uploaded_tank_3_1781683237138.jpg',
      '/assets/images/uploaded_tank_4_1781683252954.jpg',
      '/assets/images/uploaded_tank_5_1781683266079.jpg',
      '/assets/images/uploaded_tank_6_1781683278949.jpg',
      '/assets/images/uploaded_tank_7_1781683291987.jpg',
      '/assets/images/uploaded_tank_8_1781683306440.jpg',
      '/assets/images/un_standard_tank_1783488042149.jpg',
      '/assets/images/kid_dosing_tank_1783488058945.jpg',
      '/assets/images/un_mixed_agitation_1783488076632.jpg'
    ]);

    if (saved && (saved.includes('uploaded_tank_1_1781683205180.jpg') || saved.includes('uploaded_tank_5_1781683266079.jpg'))) {
      localStorage.setItem('UW_HERO_IMAGE', '/assets/images/un120_white_tank_1783489320557.jpg');
      return '/assets/images/un120_white_tank_1783489320557.jpg';
    }

    if (saved && validHeroSet.has(saved)) {
      return saved;
    }
    // 캐시가 깨져있거나, 구버전 주소이거나, 경로가 올바르지 않으면 1번 원본 UN120 백색원형 사진으로 실시간 동기 복구합니다.
    return '/assets/images/un120_white_tank_1783489320557.jpg';
  });
  const [showImageEditModal, setShowImageEditModal] = useState<boolean>(false);
  const [imageEditTemp, setImageEditTemp] = useState<string>('');

  // Interactive Smart Catalogue States
  const [showCatalogueModal, setShowCatalogueModal] = useState<boolean>(false);
  const [catalogueTab, setCatalogueTab] = useState<number>(0);
  const [chemicalSearch, setChemicalSearch] = useState<string>('');

  // Dual stateful DB products (saves dynamic edits locally)
  const [products, setProducts] = useState<Product[]>(() => {
    // 8개 주요 제품으로 엄밀 축소하고, 로컬 캐시 오염을 완전히 소거하기 위해 8개 외의 항목은 모두 배제합니다.
    const saved = localStorage.getItem('UW_PRODUCTS_V2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Product[];
        return PRODUCT_DATA.map((dp) => {
          // 기존에 저장된 동일 ID의 사용자 편집 데이터를 찾습니다.
          const edited = parsed.find((p) => p.id === dp.id || (dp.id === 'ug-3000' && p.id === 'ug-standard'));
          if (edited) {
            // 카테고리명 보정 (정형화된 세련된 명칭 유지)
            let categoryName = edited.categoryName || dp.categoryName;
            if (edited.category === 'UN_AGITATION') {
              categoryName = 'UN조 탱크';
            } else if (edited.category === 'DECK_STS') {
              categoryName = 'STS 보강형 일반 탱크';
            } else if (edited.category === 'UG_STANDARD') {
              categoryName = 'UG 보강형 일반 탱크';
            } else if (edited.category === 'UD_DISCHARGE') {
              categoryName = 'UD 완전배출 탱크';
            }

            let image = edited.image || dp.image;
            if (dp.id === 'un-standard-tank' && (!image || image.includes('uploaded_tank_5_1781683266079.jpg') || image.includes('uploaded_tank_1_1781683205180.jpg'))) {
              image = '/assets/images/un120_white_tank_1783489320557.jpg';
            }

            return {
              ...dp,
              ...edited,
              id: dp.id,
              image,
              categoryName,
            };
          }
          return dp;
        });
      } catch (e) {
        console.error('Failed to parse saved products, reverting to default data', e);
        return PRODUCT_DATA;
      }
    }
    return PRODUCT_DATA;
  });

  // Inquiries database state (saves dynamically)
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('UW_INQUIRIES');
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  // Product Form Modal States (For Create & Edit)
  const [showProductFormModal, setShowProductFormModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form Fields
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<Category>('UG_STANDARD');
  const [formImage, setFormImage] = useState<string>('');
  const [formCapacity, setFormCapacity] = useState<string>('');
  const [formDimensions, setFormDimensions] = useState<string>('');
  const [formModel, setFormModel] = useState<string>('');
  const [formManhole, setFormManhole] = useState<string>('');
  const [formThickness, setFormThickness] = useState<string>('');
  const [formFeatures, setFormFeatures] = useState<string>(''); // comma split

  // Track scrollable slider reference for featured products
  const sliderRef = useRef<HTMLDivElement>(null);

  // Synchronize dynamic lists to storage
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('UW_PRODUCTS_V2');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        let hasBrokenPath = false;
        if (Array.isArray(parsed)) {
          for (const p of parsed) {
            if (p.image && (
              p.image.includes('/assets/images/assets/') ||
              p.image.includes('googleusercontent') ||
              (p.image.startsWith('http') && 
               !p.image.includes('ultratank.netlify.app') && 
               !p.image.includes('ais-dev') && 
               !p.image.includes('ais-pre') && 
               !p.image.includes('localhost'))
            )) {
              hasBrokenPath = true;
              break;
            }
          }
        }
        if (hasBrokenPath) {
          localStorage.removeItem('UW_PRODUCTS_V2'); // Purge corrupted local storage cache
          setProducts(PRODUCT_DATA);
        }
      }
      
      const savedHero = localStorage.getItem('UW_HERO_IMAGE');
      if (savedHero && (
        savedHero.includes('/assets/images/assets/') ||
        savedHero.includes('googleusercontent') ||
        (savedHero.startsWith('http') && 
         !savedHero.includes('ultratank.netlify.app') && 
         !savedHero.includes('ais-dev') && 
         !savedHero.includes('ais-pre') && 
         !savedHero.includes('localhost'))
      )) {
        localStorage.removeItem('UW_HERO_IMAGE');
        setHeroImageUrl('/assets/images/regenerated_image_1781685239299.png');
      }
    } catch (e) {
      console.error('Storage sanitizer helper error:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('UW_PRODUCTS_V2', JSON.stringify(products));
    } catch (e) {
      console.warn('Local storage write limit or access denied:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('UW_INQUIRIES', JSON.stringify(inquiries));
    } catch (e) {
      console.warn('Local storage write limit or access denied:', e);
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('UW_IS_ADMIN', String(isAdmin));
    } catch (e) {
      console.warn('Local storage write limit or access denied:', e);
    }
  }, [isAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem('UW_HERO_BADGE', heroBadgeText);
    } catch (e) {
      console.warn('Local storage write limit or access denied:', e);
    }
  }, [heroBadgeText]);

  useEffect(() => {
    try {
      localStorage.setItem('UW_HERO_IMAGE', heroImageUrl);
    } catch (e) {
      console.warn('Local storage write limit or access denied:', e);
    }
  }, [heroImageUrl]);

  // Admin login trigger handler
  const handleAdminTrigger = () => {
    if (isAdmin) {
      if (window.confirm('관리자 권한을 해제하고 로그아웃 하시겠습니까?')) {
        setIsAdmin(false);
        setLoginId('');
        setLoginPw('');
      }
    } else {
      setLoginId('');
      setLoginPw('');
      setLoginError('');
      setShowLoginModal(true);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId.trim() === 'ultfine' && loginPw === 'ult269612!') {
      setIsAdmin(true);
      setShowLoginModal(false);
      setLoginError('');
    } else {
      setLoginError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  // Inquiry processing handlers
  const handleAddInquiry = (newInq: Inquiry) => {
    setInquiries((prev) => [newInq, ...prev]);
  };

  const handleDeleteInquiry = (inquiryId: string) => {
    if (window.confirm('이 견적 상담 문의를 정말 삭제하시겠습니까?')) {
      setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
    }
  };

  const handleUpdateInquiryStatus = (inquiryId: string, newStatus: '접수대기' | '검토중' | '답변완료') => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
    );
  };

  // Product Delete handler
  const handleDeleteProduct = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('정말로 이 제품을 카탈로그에서 삭제하시겠습니까? 관련 규격 스펙 목록에서도 모두 제거됩니다.')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  // Product Create or Edit Submit
  const handleOpenProductCreate = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('UG_STANDARD');
    setFormImage('/assets/images/ug_standard_tank_1781660874171.jpg');
    setFormCapacity('10,000 L (10톤)');
    setFormDimensions('Ø 2,500 x H 3,200 mm');
    setFormModel('UW-UG-10000');
    setFormManhole('Ø 500 mm 이중밀폐 구조');
    setFormThickness('22 mm 고밀도설계');
    setFormFeatures('LLDPE 완전 일체 성형 회전 사출 공법, 보강링 탑재 최강도 설계 구조, 독물질·화학약품 전문 영구 보존용 제어 가압 설계');
    setShowProductFormModal(true);
  };

  const handleOpenProductEdit = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormImage(prod.image);
    setFormCapacity(prod.capacity);
    setFormDimensions(prod.dimensions);
    setFormModel(prod.specs.model);
    setFormManhole(prod.specs.manhole || '');
    setFormThickness(prod.specs.thickness || '');
    setFormFeatures(prod.features.join(', '));
    setShowProductFormModal(true);
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const categoryNames: Record<Category, string> = {
      ALL: '전체제품',
      UG_STANDARD: 'UG 보강형 일반 탱크',
      UD_DISCHARGE: 'UD 완전배출 탱크',
      UN_AGITATION: 'UN조 탱크',
      DECK_STS: 'STS 보강형 일반 탱크',
    };

    const parsedFeatures = formFeatures
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingProduct) {
      // Modify existing
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === editingProduct.id) {
            return {
              ...p,
              name: formName,
              category: formCategory,
              categoryName: categoryNames[formCategory],
              image: formImage,
              capacity: formCapacity,
              dimensions: formDimensions,
              features: parsedFeatures,
              specs: {
                ...p.specs,
                model: formModel,
                capacity: formCapacity,
                diameter: formDimensions.split('x')[0]?.replace('Ø', '')?.trim() || p.specs.diameter,
                height: formDimensions.split('x')[1]?.trim() || p.specs.height,
                manhole: formManhole,
                thickness: formThickness,
              },
            };
          }
          return p;
        })
      );
    } else {
      // Add new
      const newId = `product-${Date.now()}`;
      const newProduct: Product = {
        id: newId,
        name: formName,
        category: formCategory,
        categoryName: categoryNames[formCategory],
        image: formImage,
        capacity: formCapacity,
        dimensions: formDimensions,
        features: parsedFeatures,
        isNew: true,
        specs: {
          model: formModel,
          capacity: formCapacity,
          diameter: formDimensions.split('x')[0]?.replace('Ø', '')?.trim() || 'Ø 2,500',
          height: formDimensions.split('x')[1]?.trim() || 'H 3,200',
          manhole: formManhole,
          thickness: formThickness,
        },
      };
      setProducts((prev) => [newProduct, ...prev]);
    }

    setShowProductFormModal(false);
  };

  // Hero custom badge text update submit
  const handleOpenBadgeEdit = () => {
    setBadgeEditTemp(heroBadgeText);
    setShowBadgeEditModal(true);
  };

  const handleBadgeEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroBadgeText(badgeEditTemp.trim() || 'PE 고강도 보강밴드형 케미칼탱크');
    setShowBadgeEditModal(false);
  };

  // Hero custom main image update submit
  const handleOpenImageEdit = () => {
    setImageEditTemp(heroImageUrl);
    setShowImageEditModal(true);
  };

  // Helper to compress and resize large uploaded images (prevents localStorage QuotaExceededError)
  const compressAndResizeImage = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down to max 1024px width or height
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress quality to 0.75 as JPEG to keep size minimal (~100KB)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
          callback(compressedDataUrl);
        } else {
          callback(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleHeroImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressAndResizeImage(file, (compressedBase64) => {
        setImageEditTemp(compressedBase64);
      });
    }
  };

  const handleProductImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressAndResizeImage(file, (compressedBase64) => {
        setFormImage(compressedBase64);
      });
    }
  };

  const handleImageEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroImageUrl(imageEditTemp.trim() || '/assets/images/un120_white_tank_1783489320557.jpg');
    setShowImageEditModal(false);
  };

  // Switch to contact consultation tab pre-filling a specific product
  const [prefilledQuoteProduct, setPrefilledQuoteProduct] = useState<string>('');
  
  const handleQuoteSelection = (productName: string) => {
    setPrefilledQuoteProduct(productName);
    setCurrentTab('consult');
    setTimeout(() => {
      const el = document.getElementById('consult/form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 350, behavior: 'smooth' });
      }
    }, 120);
  };

  // Scroll to featured sections
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Slider navigation
  const scrollSlider = (direction: 'LEFT' | 'RIGHT') => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'LEFT' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Filter products matching current selection and active search query
  const filteredProducts = products.filter((prod) => {
    const categoryMatches = selectedCategory === 'ALL' || prod.category === selectedCategory;
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const matchesSearch =
      normalizedQuery === '' ||
      prod.name.toLowerCase().includes(normalizedQuery) ||
      prod.capacity.toLowerCase().includes(normalizedQuery) ||
      prod.specs.model.toLowerCase().includes(normalizedQuery) ||
      prod.categoryName.toLowerCase().includes(normalizedQuery);

    return categoryMatches && matchesSearch;
  });

  // Featured lists (take first 5 stateful ones)
  const featuredProducts = products.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-slate-900 selection:text-white" id="root-container">
      
      {/* 1. Header Navigation Bar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAdmin={isAdmin}
        onAdminTrigger={handleAdminTrigger}
      />

      {/* 2. Hero banner displaying PE tanks context */}
      {currentTab === 'home' && (
        <Hero 
          onConsultClick={() => setCurrentTab('consult')} 
          heroBadgeText={heroBadgeText}
          onEditHeroBadgeText={handleOpenBadgeEdit}
          heroImageUrl={resolveAssetPath(heroImageUrl)}
          onEditHeroImageUrl={handleOpenImageEdit}
          isAdmin={isAdmin}
        />
      )}

      {/* 3. Main Body Split Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-grow w-full" id="main-content-layout">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Universal Left Sidebar component */}
          <Sidebar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onScrollToSection={handleScrollToSection}
            onViewCatalogue={() => {
              setCatalogueTab(0);
              setShowCatalogueModal(true);
            }}
          />

          {/* Right Principal content viewport depending on current selected tab */}
          <div className="flex-1 min-w-0">
            {currentTab === 'home' && (
              <div className="space-y-8 animate-in fade-in duration-300">

                {/* 🔧 간편 이미지 및 카탈로그 이지 에디터 (Easy Editor console) */}
                {!isAdmin ? (
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6 animate-in fade-in duration-350" id="easy-editor-console-trigger">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="p-3 bg-orange-50 text-orange-500 rounded-xl shrink-0 mt-0.5">
                          <Settings className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                            <span>울트라월드 실시간 간편 편집 모드 (OFF)</span>
                            <span className="inline-block w-2 h-2 rounded-full bg-slate-300"></span>
                          </h3>
                          <p className="text-slate-500 text-[11px] leading-relaxed mt-1">
                            현재 일반 모드입니다. 우측의 [편집 모드 활성화] 버튼을 켜시면 복잡한 로그인 과정 없이<br className="hidden md:block" />
                            <strong>각 제품 카드의 [수정] 버튼</strong>이 생겨나 6, 7, 8번을 포함한 모든 사진과 사양 규격을 직접 실시간으로 교체하실 수 있습니다!
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsAdmin(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-5 py-3 rounded-xl cursor-pointer shadow-md shadow-orange-500/10 transition-all whitespace-nowrap self-end sm:self-center"
                      >
                        편집 모드 활성화 (ON)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-4 mb-6 shadow-xl backdrop-blur-sm animate-in fade-in duration-350" id="easy-editor-console">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg shrink-0">
                        <Settings className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                          울트라월드 간편 편집 & 데이터 초기화 패널
                        </h3>
                        <p className="text-slate-400 text-3xs md:text-[11px] font-medium leading-relaxed">
                          코딩 필요없이 화면 상에서 제품 정보, 이미지, 배너 문구를 직접 실시간으로 제어하고 리셋할 수 있습니다.
                        </p>
                      </div>
                    </div>
                    
                    {/* 데이터 완전 초기화 */}
                    <button
                      onClick={() => {
                        if (window.confirm("기존 브라우저 로컬 캐시(로컬스토리지)에 저장되었던 이미지와 커스텀 수정 데이터를 최신 오렌지-철재 보강 밴드형 정밀 사진과 제품 목록으로 전부 정화(Reset)하여 적용하시겠습니까?\n\n이 클릭은 충돌하는 데이터 설정을 완전히 정형화하고 화면을 리프레시합니다.")) {
                          localStorage.clear();
                          window.location.reload();
                        }
                      }}
                      className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border border-slate-700/60"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      데이터 및 캐시 완전 복원(Reset)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
                    {/* 1. 간편 로그인 토글 */}
                    <div className="lg:col-span-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className="text-[11px] font-extrabold text-orange-400 block uppercase tracking-wider">01. 편집 모드 마스터 스위치</span>
                          <span className="text-slate-400 text-[10px] font-medium leading-normal block">클릭 한 번으로 모든 편집 버튼을 켜고 끌 수 있습니다.</span>
                        </div>
                        <button
                          onClick={() => setIsAdmin(false)}
                          className="px-3 py-2 rounded-xl text-xs font-extrabold bg-orange-500 text-white shadow-md shadow-orange-500/20 transition-all cursor-pointer whitespace-nowrap shrink-0 hover:bg-orange-650"
                        >
                          ON (편집 끄기)
                        </button>
                      </div>

                      <div className="bg-green-500/10 text-green-400 border border-green-500/20 p-2.5 rounded-lg text-3xs font-medium space-y-1">
                        <p className="flex items-center gap-1 font-bold">
                          <span className="w-1.5 h-1.5 bg-green-450 rounded-full shrink-0 animate-ping"></span>
                          <span>수정 권한 활성화 중:</span>
                        </p>
                        <ul className="list-disc pl-3.5 space-y-0.5 text-slate-300">
                          <li>하단 제품 카드 우상단의 <strong className="text-white font-bold">[수정]</strong> 버튼으로 각 제품 이미지/규격을 마음대로 편집</li>
                          <li>하단 제품 목록 우측 상단의 <strong className="text-white font-bold">[새 약품탱크 추가]</strong> 클릭으로 신제품 등록</li>
                          <li>상단 히어로 배너 우측 하단의 카메라 아이콘 클릭 후 배너 교체</li>
                        </ul>
                      </div>
                    </div>

                     <div className="lg:col-span-8 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 space-y-2.5 flex flex-col justify-between">
                       <div>
                         <span className="text-[11px] font-extrabold text-orange-400 block uppercase tracking-wider">02. 실물 고화질 원본 & AI 재생성 사진 (총 13종 프리셋) 메인 배너 연결</span>
                         <span className="text-slate-400 text-3xs font-medium block leading-normal">아래 버튼을 누르면 메인 탑 배너의 대표 사진을 귀하가 지정한 사진으로 즉각 교환 연동시킵니다.</span>
                       </div>
 
                       <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-1.5 mt-1 max-h-40 overflow-y-auto pr-1">
                         {[
                           { label: '01. 원본: UN120 백색원형', url: '/assets/images/un120_white_tank_1783489320557.jpg' },
                           { label: '02. 원본: 소형 백색 200L', url: '/assets/images/uploaded_tank_2_1781683222315.jpg' },
                           { label: '03. 원본: 가드데크 사다리 10톤', url: '/assets/images/uploaded_tank_3_1781683237138.jpg' },
                           { label: '04. 원본: 공장 주황보강 15톤', url: '/assets/images/uploaded_tank_4_1781683252954.jpg' },
                           { label: '05. 원본: UN120 눈금 원형', url: '/assets/images/uploaded_tank_5_1781683266079.jpg' },
                           { label: '06. 원본: 사각 도징용 백색탱크', url: '/assets/images/uploaded_tank_6_1781683278949.jpg' },
                           { label: '07. 원본: 광택 STS 보강 밴드', url: '/assets/images/uploaded_tank_7_1781683291987.jpg' },
                           { label: '08. 원본: 야외 주황 가드 사다리', url: '/assets/images/uploaded_tank_8_1781683306440.jpg' },
                           { label: '★ AI: UG 오렌지 철재거치', url: '/assets/images/regenerated_image_1781685239299.png' },
                           { label: '★ AI: 안전 가드데크 사다리', url: '/assets/images/regenerated_image_1781685912943.png' },
                           { label: '★ AI: 공장 거치형 주황보강', url: '/assets/images/regenerated_image_1781685907524.png' },
                           { label: '★ AI: UN형 교반탱크', url: '/assets/images/regenerated_image_1781688139818.png' },
                           { label: '★ AI: STS보강 고화질 탱크', url: '/assets/images/regenerated_image_1781688142077.png' },
                         ].map((preset, index) => {
                           const isCurrent = heroImageUrl === preset.url;
                           return (
                             <button
                               key={index}
                               onClick={() => {
                                 setHeroImageUrl(preset.url);
                                 setImageEditTemp(preset.url);
                               }}
                               className={`p-1.5 rounded-lg text-[10px] font-semibold text-left transition-all border shrink-0 flex items-center justify-between cursor-pointer ${
                                 isCurrent 
                                   ? 'border-orange-500 bg-orange-500/10 text-orange-400 font-extrabold' 
                                   : 'border-slate-850 bg-slate-900 hover:border-slate-700 text-slate-400'
                               }`}
                             >
                               <span className="truncate">{preset.label}</span>
                               {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 ml-1"></span>}
                             </button>
                           );
                         })}
                      </div>
                    </div>
                  </div>
                </div>
                )}
                
                {/* Product Search Filtering HUD status */}
                {searchQuery && (
                  <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-xs">
                    <span>
                      &ldquo;<strong>{searchQuery}</strong>&rdquo; 단어에 대한 검색 결과가{' '}
                      <strong>{filteredProducts.length}</strong>건 발견되었습니다.
                    </span>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="underline font-bold text-[11px] hover:text-amber-750"
                    >
                      검색 초기화
                    </button>
                  </div>
                )}

                {/* ② 일반제품 Grid (4-column layout) */}
                <section className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <span className="w-1 h-5 bg-blue-600 rounded-full shrink-0"></span>
                        {selectedCategory === 'ALL' 
                          ? '주요 제품 목록' 
                          : `${products.find(p => p.category === selectedCategory)?.categoryName || '해당 카테고리'} 목록`
                        }
                      </h2>
                    </div>

                    {/* Admin Add Product trigger Button */}
                    {isAdmin && (
                      <button
                        onClick={handleOpenProductCreate}
                        className="inline-flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-lg shadow-sm transition-all shrink-0 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        새 약품탱크 제품 추가
                      </button>
                    )}
                  </div>

                  {/* Responsive grid mapping */}
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6" id="product-showroom-grid">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onQuoteInquire={handleQuoteSelection}
                          isAdmin={isAdmin}
                          onEditProduct={handleOpenProductEdit}
                          onDeleteProduct={handleDeleteProduct}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                      <p className="text-slate-400 text-xs text-center">선택하신 카테고리 또는 단어와 매칭되는 약품 탱크 제품이 준비되지 않았습니다.</p>
                      <button 
                        onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
                        className="mt-3 bg-slate-900 text-white font-bold text-2xs px-3.5 py-2 rounded-lg cursor-pointer"
                      >
                        전체제품 보기
                      </button>
                    </div>
                  )}
                </section>

              </div>
            )}

            {/* View: 회사소개 */}
            {currentTab === 'intro' && <CompanyIntro />}

            {/* View: 제품분류 specifications database mapping */}
            {currentTab === 'products' && (
              <ProductSpecsList 
                onQuoteClick={handleQuoteSelection} 
              />
            )}

            {/* View: 온라인상담 submission form */}
            {currentTab === 'consult' && (
              <div className="animate-in fade-in duration-300 space-y-6" id="consult/form">
                <ConsultationForm
                  initialInquiries={inquiries}
                  onAddInquiry={handleAddInquiry}
                  prefilledProduct={prefilledQuoteProduct}
                  isAdmin={isAdmin}
                  onDeleteInquiry={handleDeleteInquiry}
                  onUpdateInquiryStatus={handleUpdateInquiryStatus}
                />
              </div>
            )}

          </div>

        </div>
      </main>

      {/* 4. Footer Corporate Information section */}
      <Footer />

      {/* ======================================================= */}
      {/* ADMIN LEVEL SYSTEM MODALS */}
      {/* ======================================================= */}

      {/* A. Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-950/65 flex items-center justify-center z-100 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-md">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">울트라월드 관리자 로그인</h3>
              <p className="text-slate-500 text-2xs md:text-xs">
                홈페이지 콘텐츠를 편집할 수 있는 승인 계정입니다.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">관리자 아이디</label>
                <input 
                  type="text" 
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="아이디를 입력하세요"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">비밀번호</label>
                <input 
                  type="password" 
                  value={loginPw}
                  onChange={(e) => setLoginPw(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  required
                />
              </div>

              {loginError && (
                <p className="text-[10px] font-bold text-rose-600 text-center bg-rose-50 p-2 rounded">
                  {loginError}
                </p>
              )}

              <button 
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-xs py-3 rounded-lg shadow-md transition-all cursor-pointer"
              >
                관리자 권한 확인 및 로그인
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 text-center space-y-2">
              <span className="text-[10px] text-slate-400 block font-medium leading-normal">
                혹시 브라우저에 구버전 임시데이터나 깨진 이미지(엑박)가 남아있나요?
              </span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("기존 브라우저 로컬 캐시(로컬스토리지)에 저장되었던 이미지와 커스텀 수정 데이터를 최신 오렌지-철재 보강 밴드형 정밀 사진과 제품 목록으로 전부 원천 초기화(Reset)하여 복구하시겠습니까?\n\n이 작업은 깨진 이미지 엑박 현상을 즉시 정형화 해결하고 화면을 리프레시합니다.")) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="inline-flex items-center gap-1.5 justify-center w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200/50"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500 animate-spin-slow" />
                데이터 및 캐시 완전 복원 (Reset Cache)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. Hero central banner Badge editing modal */}
      {showBadgeEditModal && (
        <div className="fixed inset-0 bg-slate-950/65 flex items-center justify-center z-100 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setShowBadgeEditModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-5">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                <Edit className="w-5 h-5 text-orange-500" />
                상단 배너 중앙 문구 수정
              </h3>
              <p className="text-slate-500 text-2xs md:text-xs">
                메인 배너 탱크 사진 하단의 라벨 텍스트를 실시간으로 직접 변경합니다.
              </p>
            </div>

            <form onSubmit={handleBadgeEditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">배지 텍스트</label>
                <input 
                  type="text" 
                  value={badgeEditTemp}
                  onChange={(e) => setBadgeEditTemp(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowBadgeEditModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-2xs font-extrabold cursor-pointer"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-2xs font-extrabold cursor-pointer"
                >
                  저장 및 적용
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B-2. Hero main image editing modal */}
      {showImageEditModal && (
        <div className="fixed inset-0 bg-slate-950/65 flex items-center justify-center z-100 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setShowImageEditModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-5">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                <Edit className="w-5 h-5 text-orange-500" />
                상단 배너 대표 이미지 수정 및 선택
              </h3>
              <p className="text-slate-500 text-2xs md:text-xs">
                메인 배너 단상에 표시될 고화질 탱크 사진 주소를 수정하거나 아래 옵션들 중에서 즉시 선택합니다.
              </p>
            </div>

            <form onSubmit={handleImageEditSubmit} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">내 컴퓨터에서 이미지 직접 업로드</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-orange-500 rounded-xl p-4 cursor-pointer transition-all bg-slate-50 hover:bg-orange-50/20 group">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-orange-500 mb-1.5" />
                    <span className="text-2xs font-extrabold text-slate-700 group-hover:text-orange-600">이곳을 클릭하여 사진 파일 선택</span>
                    <span className="text-3xs text-slate-400 mt-0.5">PNG, JPG, JPEG, GIF 등 이미지 파일 지원</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleHeroImageFileChange} 
                      className="hidden" 
                    />
                  </label>
                </div>

                {imageEditTemp && (
                  <div className="border border-slate-100 rounded-lg p-2 bg-slate-50 flex items-center gap-3">
                    <div className="w-12 h-12 rounded overflow-hidden bg-white border border-slate-200 shrink-0">
                      <img src={resolveAssetPath(imageEditTemp)} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold text-slate-500 block uppercase">미리보기</span>
                      <span className="text-[9px] text-slate-400 block truncate">{imageEditTemp.startsWith('data:') ? '직접 업로드된 파일 이미지' : imageEditTemp}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">또는 이미지 주소 링크(URL)</label>
                  <input 
                    type="text" 
                    value={imageEditTemp}
                    onChange={(e) => setImageEditTemp(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium font-mono"
                    placeholder="이미지 URL을 직접 입력"
                    required
                  />
                </div>
              </div>

              {/* Quick presets for easier admin choice */}
              <div className="hidden">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">실물 고화질 탱크 사진 8종 선택</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { label: '01. UG 오렌지 철재거치', url: '/assets/images/regenerated_image_1781685239299.png' },
                    { label: '02. 사각 도징용 백색', url: '/assets/images/uploaded_tank_6_1781683278949.jpg' },
                    { label: '03. 안전 가드데크 사다리', url: '/assets/images/regenerated_image_1781685912943.png' },
                    { label: '04. 공장 거치형 주황보강', url: '/assets/images/regenerated_image_1781685907524.png' },
                    { label: '05. 소형 백색 주입용', url: '/assets/images/uploaded_tank_2_1781683222315.jpg' },
                    { label: '06. UN120 눈금 백색원형', url: '/assets/images/uploaded_tank_5_1781683266079.jpg' },
                    { label: '07. 광택 STS 보강 밴드', url: '/assets/images/uploaded_tank_7_1781683291987.jpg' },
                    { label: '08. 야외 주황 가드 사다리', url: '/assets/images/uploaded_tank_8_1781683306440.jpg' },
                  ].map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setImageEditTemp(preset.url)}
                      className={`p-2 border text-left rounded-lg text-3xs transition-all cursor-pointer ${
                        imageEditTemp === preset.url 
                          ? 'border-orange-500 bg-orange-50/50 text-orange-700 font-bold' 
                          : 'border-slate-200 hover:border-slate-350 text-slate-600'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowImageEditModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-2xs font-extrabold cursor-pointer"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-2xs font-extrabold cursor-pointer"
                >
                  대표사진 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. Dynamic Product Register & Modifier Modal */}
      {showProductFormModal && (
        <div className="fixed inset-0 bg-slate-950/65 flex items-center justify-center z-100 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative animate-in zoom-in-95 duration-150 my-8">
            <button 
              onClick={() => setShowProductFormModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-5">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                {editingProduct ? '카탈로그 정교 제품 수정' : '신규 약품탱크 제품 카탈로그 등록'}
              </h3>
              <p className="text-slate-500 text-2xs md:text-xs">
                공식 쇼룸 단상에 출력될 고정 규격 모델 정보를 입력해 주세요.
              </p>
            </div>

            <form onSubmit={handleProductFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">제품명</label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="예: 초고강도 공업용 교반탱크"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-none font-medium"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">카테고리</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-none font-medium"
                  >
                    <option value="UG_STANDARD">UG 보강형 일반 탱크</option>
                    <option value="UD_DISCHARGE">UD 완전배출 탱크</option>
                    <option value="UN_AGITATION">UN조 탱크</option>
                    <option value="DECK_STS">STS 보강형 일반 탱크</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Image Preset Selector Helper */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11.5px] font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="text-orange-500 font-extrabold">📸</span> 원클릭 장비 이미지 프리셋 선택 (총 13종 완벽 지원)
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-13 gap-1 max-h-44 overflow-y-auto p-1 bg-white rounded-lg border border-slate-100">
                  {[
                    { label: '01. UN120 백색원형', img: '/assets/images/un120_white_tank_1783489320557.jpg' },
                    { label: '02. 소형 백색 200L', img: '/assets/images/uploaded_tank_2_1781683222315.jpg' },
                    { label: '03. 가드데크 10톤', img: '/assets/images/uploaded_tank_3_1781683237138.jpg' },
                    { label: '04. 공장 주황 15톤', img: '/assets/images/uploaded_tank_4_1781683252954.jpg' },
                    { label: '05. UN120 눈금원형', img: '/assets/images/uploaded_tank_5_1781683266079.jpg' },
                    { label: '06. 사각 도징용 백색', img: '/assets/images/uploaded_tank_6_1781683278949.jpg' },
                    { label: '07. 광택 STS 보강', img: '/assets/images/uploaded_tank_7_1781683291987.jpg' },
                    { label: '08. 야외 주황 사다리', img: '/assets/images/uploaded_tank_8_1781683306440.jpg' },
                    { label: '★ UG 주황 (AI)', img: '/assets/images/regenerated_image_1781685239299.png' },
                    { label: '★ 가드데크 (AI)', img: '/assets/images/regenerated_image_1781685912943.png' },
                    { label: '★ 공장 보강 (AI)', img: '/assets/images/regenerated_image_1781685907524.png' },
                    { label: '★ UN 교반형 (AI)', img: '/assets/images/regenerated_image_1781688139818.png' },
                    { label: '★ STS 보강 (AI)', img: '/assets/images/regenerated_image_1781688142077.png' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormImage(preset.img)}
                      className={`text-[8px] font-bold rounded p-1 border text-center transition-all cursor-pointer ${
                        formImage === preset.img 
                          ? 'border-orange-500 bg-orange-50 text-orange-700 font-extrabold' 
                          : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      <div className="w-full h-7 bg-slate-100 rounded overflow-hidden mb-1 pointer-events-none">
                        <img src={resolveAssetPath(preset.img)} className="w-full h-full object-cover animate-fade-in" referrerPolicy="no-referrer" />
                      </div>
                      <span className="block truncate text-[7.5px] leading-none font-medium">{preset.label}</span>
                    </button>
                  ))}
                </div>
                
                {/* Genuine File Upload or Manual Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block">내 컴퓨터에서 이미지 직접 업로드</label>
                    <label className="flex flex-col items-center justify-center border border-dashed border-slate-200 hover:border-orange-500 rounded-lg p-2.5 cursor-pointer transition-all bg-white hover:bg-orange-50/10 group">
                      <Upload className="w-5 h-5 text-slate-400 group-hover:text-orange-500 mb-1" />
                      <span className="text-[9px] font-bold text-slate-600 group-hover:text-orange-600">사진 파일 선택</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleProductImageFileChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block">또는 이미지 주소 링크(URL) 직접 입력</label>
                    <textarea 
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="https://... 또는 직접 업로드된 이미지 데이터"
                      className="w-full h-[52px] text-[10px] p-2 border border-slate-200 rounded bg-white focus:outline-none resize-none font-mono"
                      required
                    />
                  </div>
                </div>

                {formImage && (
                  <div className="border border-slate-150 rounded-lg p-1.5 bg-white flex items-center gap-2">
                    <div className="w-9 h-9 rounded overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                      <img src={resolveAssetPath(formImage)} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase leading-none mb-0.5">제품 사진 미리보기</span>
                      <span className="text-[8px] text-slate-400 block truncate">{formImage.startsWith('data:') ? '사용자 직접 업로드 파일' : formImage}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">저장 용량 (Capacity)</label>
                  <input 
                    type="text" 
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    placeholder="예: 15,050 리터 (15톤)"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none font-medium"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">외경 규격 (Dimensions)</label>
                  <input 
                    type="text" 
                    value={formDimensions}
                    onChange={(e) => setFormDimensions(e.target.value)}
                    placeholder="예: Ø 2,900 x H 3,750 mm"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">규격 모델명</label>
                  <input 
                    type="text" 
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    placeholder="예: UW-UD-15000"
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded focus:outline-none font-medium"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">맨홀 규격</label>
                  <input 
                    type="text" 
                    value={formManhole}
                    onChange={(e) => setFormManhole(e.target.value)}
                    placeholder="Ø 500 mm 스크류식"
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded focus:outline-none font-medium"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">자재 두께</label>
                  <input 
                    type="text" 
                    value={formThickness}
                    onChange={(e) => setFormThickness(e.target.value)}
                    placeholder="25 mm 보공식 설계"
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded focus:outline-none font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">주요 강점 / 장치 특이 사항 (쉼표로 구분)</label>
                <textarea 
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  placeholder="LLDPE 회전 성형 공법 적용, 내후성 보강 안정성 설계, 플랜지 타공 즉각 대응"
                  rows={2}
                  className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none font-medium"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowProductFormModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-2xs font-extrabold cursor-pointer"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-2xs font-extrabold cursor-pointer"
                >
                  {editingProduct ? '장비 정보 수정 완료' : '전용 신품 탱크 전송 등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* D. Interactive Smart Catalogue Viewer Modal */}
      {showCatalogueModal && (
        <div className="fixed inset-0 bg-slate-950/75 flex items-center justify-center z-100 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
            
            {/* Header section */}
            <div className="bg-slate-900 text-white p-5 md:p-6 border-b border-slate-950 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base md:text-lg flex items-center gap-2">
                    울트라월드 주식회사 종합 스마트 카달로그
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                    Ultra Chemical Tank Official Digital Brochure (5-Page System)
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowCatalogueModal(false)}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 p-2 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation tabs inside the sheet */}
            <div className="bg-slate-50 border-b border-slate-200 p-2 md:px-6 md:py-3 overflow-x-auto flex items-center gap-1.5 scrollbar-thin shrink-0">
              {[
                { title: '1. 카달로그 표지', icon: BookOpen },
                { title: '2. UG 일반형 규격표', icon: Eye },
                { title: '3. 정밀 내약품성 사전', icon: ShieldCheck },
                { title: '4. UN조 규격표', icon: Info },
                { title: '5. 설치 보강 주의사항', icon: AlertTriangle },
              ].map((tab, idx) => {
                const isActive = catalogueTab === idx;
                const TabIcon = tab.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setCatalogueTab(idx)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-orange-500 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Content viewbody viewport (scrollable area) */}
            <div className="p-6 overflow-y-auto flex-1 min-h-0 bg-slate-50/20">
              
              {/* PAGE 1: COVER PAGE HERO */}
              {catalogueTab === 0 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 text-white rounded-2xl p-6 md:p-8 border border-slate-950 shadow-md">
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest border border-orange-500/30 px-2 py-0.5 rounded-full bg-orange-950/35">
                        Brand Premium Brochure Cover
                      </span>
                      <h4 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
                        ULTRA CHEMICAL <span className="text-orange-500">TANK</span>
                      </h4>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        We'll be near you all the way for advanced technology and customer satisfaction.
                      </p>
                      <div className="h-[2px] bg-gradient-to-r from-orange-500 to-transparent w-32" />
                      <div className="space-y-2 text-2xs md:text-xs">
                        <p className="text-slate-300">● <strong>제조원:</strong> 울트라월드 주식회사 (ULTRA WORLD CO., Ltd)</p>
                        <p className="text-slate-300">● <strong>온라인 도메인:</strong> www.ultratank.co.kr</p>
                        <p className="text-slate-300">● <strong>주 생산제:</strong> 폴리에틸렌 보강식 케미칼 저장탱크 전문</p>
                      </div>
                    </div>
                    {/* Visual representative tank */}
                    <div className="relative rounded-xl overflow-hidden border-4 border-slate-850 h-64 shadow-2xl bg-slate-800">
                      <img 
                        src={resolveAssetPath(heroImageUrl)} 
                        alt="울트라 화학 탱크 대표" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                      <h5 className="font-extrabold text-xs text-slate-800">100% 무독성 소재</h5>
                      <p className="text-[11px] text-slate-500">압출 성형 전용 최고급 LLDPE/HDPE 정품 레진만을 사용하여 냄새와 유해성 걱정이 없습니다.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                      <h5 className="font-extrabold text-xs text-slate-800">다양한 옵션 호환</h5>
                      <p className="text-[11px] text-slate-500">PVC, PE 플랜지 노즐, 아크릴 투명 수위계 및 교반 프롬데크와 STS 보강 밴드 체결까지 맞춤 제공.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 2: UG SPEC PROTOCOL */}
              {catalogueTab === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-orange-50 p-4 border border-orange-200 rounded-xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs text-orange-950">UG형(일반형) 오렌지 밴딩 울트라 탱크 규격표</h4>
                      <p className="text-[11px] text-orange-800 leading-normal">
                        수평 가설대 및 평판 콘크리트 몰탈 바닥 위에 안심 고정하는 최다 판매 시그니처 형상 규격표입니다. 
                        오렌지 및 블랙 탱크 컬러 선택이 가능하며, 계량 및 벤팅 홀, 레벨 게이지 안전 장치가 매칭됩니다.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-150 rounded-xl bg-white shadow-2xs">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                          <th className="p-2.5">모델구분</th>
                          <th className="p-2.5">호칭 용량 (L)</th>
                          <th className="p-2.5">외경 (Ø, mm)</th>
                          <th className="p-2.5">수면고 (E, mm)</th>
                          <th className="p-2.5">노즐고 (D, mm)</th>
                          <th className="p-2.5">전고 (C, mm)</th>
                          <th className="p-2.5">안전 두께 (t)</th>
                          <th className="p-2.5 text-center">도면견적</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-slate-600">
                        {[
                          { model: 'UG-30000', capacity: '30,000 L', diameter: '2,800', water: '5,100', nozzle: '5,420', height: '5,670', thickness: '15' },
                          { model: 'UG-20000', capacity: '20,000 L', diameter: '2,800', water: '3,500', nozzle: '3,780', height: '3,980', thickness: '13~15' },
                          { model: 'UG-15000', capacity: '15,000 L', diameter: '2,570', water: '3,100', nozzle: '3,350', height: '3,600', thickness: '12~14' },
                          { model: 'UG-10000', capacity: '10,000 L', diameter: '2,340', water: '2,430', nozzle: '2,780', height: '3,060', thickness: '12~14' },
                          { model: 'UG-8000',  capacity: '8,000 L',  diameter: '2,110', water: '2,400', nozzle: '2,770', height: '3,000', thickness: '12~14' },
                          { model: 'UG-6000',  capacity: '6,000 L',  diameter: '1,900', water: '2,270', nozzle: '2,600', height: '2,870', thickness: '10~12' },
                          { model: 'UG-5000',  capacity: '5,000 L',  diameter: '1,880', water: '1,900', nozzle: '2,210', height: '2,430', thickness: '7~9' },
                          { model: 'UG-4000',  capacity: '4,000 L',  diameter: '1,710', water: '1,840', nozzle: '2,150', height: '2,380', thickness: '7~9' },
                          { model: 'UG-3000',  capacity: '3,000 L',  diameter: '1,535', water: '1,640', nozzle: '1,820', height: '2,080', thickness: '6~8' },
                          { model: 'UG-2000',  capacity: '2,000 L',  diameter: '1,380', water: '1,410', nozzle: '1,570', height: '1,760', thickness: '5~6' },
                          { model: 'UG-1500',  capacity: '1,500 L',  diameter: '1,240', water: '1,290', nozzle: '1,520', height: '1,700', thickness: '5~6' },
                          { model: 'UG-1000',  capacity: '1,000 L',  diameter: '1,095', water: '1,130', nozzle: '1,280', height: '1,430', thickness: '4~6' },
                          { model: 'UG-800',   capacity: '800 L',   diameter: '990',   water: '1,120', nozzle: '1,320', height: '1,450', thickness: '4~6' },
                          { model: 'UG-600',   capacity: '600 L',   diameter: '925',   water: '940',   nozzle: '1,040', height: '1,180', thickness: '4~5' },
                          { model: 'UG-400',   capacity: '400 L',   diameter: '840',   water: '825',   nozzle: '895',   height: '1,050', thickness: '4~5' },
                          { model: 'UG-200',   capacity: '200 L',   diameter: '650',   water: '650',   nozzle: '740',   height: '850',   thickness: '3~4' },
                        ].map((row) => (
                          <tr key={row.model} className="hover:bg-slate-50 transition-colors">
                            <td className="p-2 font-extrabold text-slate-800">{row.model}</td>
                            <td className="p-2">{row.capacity}</td>
                            <td className="p-2">{row.diameter}</td>
                            <td className="p-2">{row.water}</td>
                            <td className="p-2">{row.nozzle}</td>
                            <td className="p-2">{row.height}</td>
                            <td className="p-2 font-bold text-orange-600">{row.thickness}t</td>
                            <td className="p-2 text-center">
                              <button 
                                onClick={() => {
                                  setShowCatalogueModal(false);
                                  setPrefilledQuoteProduct(`UG일반형 ${row.model} (${row.capacity})`);
                                  setCurrentTab('consult');
                                }}
                                className="bg-slate-900 text-white font-extrabold px-1.5 py-1 rounded text-[9px] hover:bg-orange-500 hover:text-white cursor-pointer transition-all"
                              >
                                문의
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PAGE 3: CHEMICAL RESISTANCE DICTIONARY */}
              {catalogueTab === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-amber-50/50 p-4 border border-amber-200 rounded-xl space-y-1">
                    <h4 className="font-extrabold text-xs text-amber-950 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      실시간 대화형 울트라 탱크 내약품성(Chemical Resistance) 일람표
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-normal">
                      아래 검색창에 화학약품의 한글명 또는 화학 기호를 쓰시면 안심 보관 여부가 실시간 검색됩니다. 
                      기본 폴리에틸렌 재질과 탱크 성형 반응 여부를 미리 판정하실 수 있습니다.
                    </p>
                  </div>

                  {/* Chemical Search Engine Box */}
                  <div className="relative">
                    <input 
                      type="text"
                      className="w-full px-4 py-3 pl-11 text-xs border border-slate-250 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                      placeholder="자주 쓰는 화학 물질 입력 (예: 염산, 황산, NaOH, 불산, 초산 등)..."
                      value={chemicalSearch}
                      onChange={(e) => setChemicalSearch(e.target.value)}
                    />
                    <div className="absolute left-4 top-3 text-slate-400">
                      <Eye className="w-4 h-4" />
                    </div>
                    {chemicalSearch && (
                      <button 
                        onClick={() => setChemicalSearch('')}
                        className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 font-extrabold text-xs cursor-pointer"
                      >
                        지우기
                      </button>
                    )}
                  </div>

                  {/* Dictionary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-96 overflow-y-auto pr-1">
                    {CHEMICAL_RESISTANCE_DATA.filter((rec) => {
                      const query = chemicalSearch.toLowerCase().trim();
                      return !query || 
                             rec.name.toLowerCase().includes(query) || 
                             rec.formula.toLowerCase().includes(query) || 
                             rec.concentration.toLowerCase().includes(query);
                    }).map((rec, index) => {
                      
                      const getResBadge = (val: string) => {
                        if (val === 'GOOD') {
                          return (
                            <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded text-[10px] bg-green-50 text-green-700 border border-green-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> 양호 (◯)
                            </span>
                          );
                        }
                        if (val === 'OK') {
                          return (
                            <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                              <Info className="w-3.5 h-3.5 text-amber-600" /> 제한적 (△)
                            </span>
                          );
                        }
                        if (val === 'BAD') {
                          return (
                            <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded text-[10px] bg-rose-50 text-rose-700 border border-rose-200">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" /> 비장착 (✕)
                            </span>
                          );
                        }
                        return (
                          <span className="inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded text-[10px] bg-orange-50 text-orange-700 border border-orange-200">
                            유의 (E)
                          </span>
                        );
                      };

                      return (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-orange-200 hover:shadow-2xs transition-all flex flex-col justify-between space-y-2">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h5 className="font-extrabold text-xs text-slate-900">{rec.name}</h5>
                              <p className="text-[10px] text-slate-505 font-mono">기호: {rec.formula} | 한계농도: {rec.concentration}</p>
                            </div>
                            <span className="text-[10px] bg-slate-10 w-8 text-center text-slate-400 px-1 py-0.5 border border-slate-150 rounded font-mono">No. {index+1}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg text-[10px]">
                            <div className="flex justify-between items-center px-1">
                              <span className="text-slate-500">20℃ 상온 보관</span>
                              {getResBadge(rec.res20)}
                            </div>
                            <div className="flex justify-between items-center px-1 border-l border-slate-200">
                              <span className="text-slate-505">60℃ 고온 한계</span>
                              {getResBadge(rec.res60)}
                            </div>
                          </div>

                          <p className="text-[10px] text-slate-500 leading-normal bg-slate-100/50 p-1.5 rounded text-left">
                            <strong>전문 소견:</strong> {rec.note}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-slate-400 leading-normal text-center bg-slate-50 p-3 rounded-lg border border-slate-150">
                    ※ 기재되지 않은 특수 혼합 약액(도금 폐수, 유기 용제 복합액)의 담수 지탱 여부는 울트라월드 정밀 기술 설계부(<strong>010-3887-6107</strong>)에 화학 조성을 전달 주시면 정밀한 계산값을 메일로 발송해 드립니다.
                  </p>
                </div>
              )}

              {/* PAGE 4: UN / KID AGITATION SMALL SPEC */}
              {catalogueTab === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-950 shadow-sm">
                    <h4 className="font-extrabold text-xs text-orange-400">UN형 / KID형 울트라 약정량 소형탱크 규격표</h4>
                  </div>

                  <div className="overflow-x-auto border border-slate-150 rounded-xl bg-white shadow-2xs">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                          <th className="p-3">품명 (Model)</th>
                          <th className="p-3">용량 (L)</th>
                          <th className="p-3">외경 (mm)</th>
                          <th className="p-3">전고 (mm)</th>
                          <th className="p-3">두께 (t)</th>
                          <th className="p-3 text-center">도면견적</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-slate-600">
                        {UN_KID_SPEC_DATA.map((rec) => (
                          <tr key={rec.model} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-extrabold text-slate-800">{rec.model}</td>
                            <td className="p-3 font-bold text-slate-900">{rec.capacity}</td>
                            <td className="p-3">{rec.diameter}</td>
                            <td className="p-3">{rec.height}</td>
                            <td className="p-3 text-orange-600 font-bold">{rec.thickness}mm</td>
                            <td className="p-3 text-center">
                              <button 
                                onClick={() => {
                                  setShowCatalogueModal(false);
                                  setPrefilledQuoteProduct(`소형교반형 ${rec.model} (${rec.capacity})`);
                                  setCurrentTab('consult');
                                }}
                                className="bg-slate-900 text-white font-extrabold px-1.5 py-1 rounded text-[9px] hover:bg-orange-500 cursor-pointer transition-all"
                              >
                                전송문의
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PAGE 5: STRUCTURAL / SETUP CAUTION DETAILS */}
              {catalogueTab === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-rose-50 text-rose-950 rounded-xl p-4 border border-rose-200 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <h4 className="font-bold text-xs text-rose-950">울트라 탱크 안심 설치 공사 및 사용상의 핵심 주의사항</h4>
                      <p className="text-[11px] text-rose-800 leading-normal">
                        폴리에틸렌 케미칼 탱크는 성형 가공 후 충격과 온도 유의점을 정확하게 지키실 때 반영구적(평생 수명) 안심 동작이 보장됩니다.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Column A: Rules list */}
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                        <h5 className="font-extrabold text-xs text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> 구조 및 온도 주의사항 (Structure)
                        </h5>
                        <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4 leading-normal">
                          {CAUTION_DATA.structural.map((item, id) => (
                            <li key={id}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                        <h5 className="font-extrabold text-xs text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> 운반 상의 대책 가이드 (Logistics)
                        </h5>
                        <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4 leading-normal">
                          {CAUTION_DATA.logistics.map((item, id) => (
                            <li key={id}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Column B: Rules list and layout drawings */}
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                        <h5 className="font-extrabold text-xs text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> 설치 시공 바닥 설치 기준 (Installation)
                        </h5>
                        <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4 leading-normal">
                          {CAUTION_DATA.setup.map((item, id) => (
                            <li key={id}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Visual Drawing representations */}
                      <div className="bg-slate-900 rounded-xl p-4 text-white space-y-2 text-2xs font-mono">
                        <h5 className="text-orange-400 font-extrabold text-xs">설치 기초도 안전 가이드 (도식 요약)</h5>
                        
                        <div className="grid grid-cols-2 gap-3 text-center border-t border-slate-800 pt-2 shrink-0">
                          <div className="bg-slate-850 p-2 rounded border border-green-500/30">
                            <span className="text-green-500 font-bold block mb-1">◯ 양호 기초대</span>
                            <div className="border-t border-slate-500 w-12 mx-auto my-1" />
                            <p className="text-slate-400 text-[10px]">콘크리트 평평한 면 또는 평판 완비 철제</p>
                          </div>
                          <div className="bg-slate-850 p-2 rounded border border-red-500/30">
                            <span className="text-red-500 font-bold block mb-1">✕ 부실 기초대</span>
                            <div className="border-t border-dashed border-red-500 w-12 mx-auto my-1" />
                            <p className="text-slate-400 text-[10px]">L형강 등 하부 평판 없이 탱크 부양 안됨</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer action button inside the sheet */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 gap-3 flex justify-between items-center shrink-0">
              <span className="text-[10px] md:text-2xs text-slate-500 font-bold">
                ⓒ 울트라월드 주식회사 기술 데이터베이스 (Tel: 010-3887-6107)
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowCatalogueModal(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-2xs font-extrabold cursor-pointer"
                >
                  카달로그 닫기
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
