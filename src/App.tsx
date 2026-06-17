/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PRODUCT_DATA, INITIAL_INQUIRIES } from './data';
import { Product, Category, Inquiry } from './types';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CompanyIntro from './components/CompanyIntro';
import ProductSpecsList from './components/ProductSpecsList';
import ConsultationForm from './components/ConsultationForm';
import Footer from './components/Footer';

import { ChevronLeft, ChevronRight, Plus, X, Lock, ShieldCheck, Edit, Trash2 } from 'lucide-react';

export default function App() {
  // Navigation & Page Tabs
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active product details modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('UW_IS_ADMIN') === 'true';
  });

  // Admin Login Modal States
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginId, setLoginId] = useState<string>('');
  const [loginPw, setLoginPw] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Custom Editable Badge on Hero banner
  const [heroBadgeText, setHeroBadgeText] = useState<string>(() => {
    return localStorage.getItem('UW_HERO_BADGE') || 'Orange Active Ring PE Tank';
  });
  const [showBadgeEditModal, setShowBadgeEditModal] = useState<boolean>(false);
  const [badgeEditTemp, setBadgeEditTemp] = useState<string>('');

  // Dual stateful DB products (saves dynamic edits locally)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('UW_PRODUCTS');
    return saved ? JSON.parse(saved) : PRODUCT_DATA;
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
    localStorage.setItem('UW_PRODUCTS', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('UW_INQUIRIES', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('UW_IS_ADMIN', String(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('UW_HERO_BADGE', heroBadgeText);
  }, [heroBadgeText]);

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
      setLoginError('아이디 또는 비밀번호가 올바르지 않습니다. (ID: ultfine)');
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
    setFormImage('/src/assets/images/ug_standard_tank_1781660874171.jpg');
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
      UN_AGITATION: 'UN 화학 교반조 탱크',
      DECK_STS: '테라스 & STS 부속 자재',
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
    setHeroBadgeText(badgeEditTemp.trim() || 'Orange Active Ring PE Tank');
    setShowBadgeEditModal(false);
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
          />

          {/* Right Principal content viewport depending on current selected tab */}
          <div className="flex-1 min-w-0">
            {currentTab === 'home' && (
              <div className="space-y-12 animate-in fade-in duration-300">
                
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

                {/* ① 주요제품 (Featured Slider section) */}
                {!searchQuery && (
                  <section className="space-y-4" id="featured-showcase">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2" id="product-showroom-title">
                          <span className="w-1 h-5 bg-blue-600 rounded-full shrink-0"></span>
                          주요 대표 제품 안내
                        </h2>
                      </div>

                      {/* Slider Navigation controllers */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => scrollSlider('LEFT')}
                          className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors shadow-2xs cursor-pointer"
                          aria-label="이전 제품 보기"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => scrollSlider('RIGHT')}
                          className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors shadow-2xs cursor-pointer"
                          aria-label="다음 제품 보기"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Horizontal scrollable box container */}
                    <div 
                      ref={sliderRef}
                      className="flex gap-4 overflow-x-auto scroll-smooth pb-4 no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory"
                    >
                      {featuredProducts.map((prod) => (
                        <div 
                          key={`feat-${prod.id}`}
                          className="w-72 shrink-0 snap-start"
                        >
                          <ProductCard 
                            product={prod} 
                            onViewDetails={(p) => setSelectedProduct(p)} 
                            isAdmin={isAdmin}
                            onEditProduct={handleOpenProductEdit}
                            onDeleteProduct={handleDeleteProduct}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ② 일반제품 Grid (4-column layout) */}
                <section className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <span className="w-1 h-5 bg-blue-600 rounded-full shrink-0"></span>
                        {selectedCategory === 'ALL' 
                          ? '일반제품 전체 목록' 
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
                          onViewDetails={(p) => setSelectedProduct(p)}
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
                onViewProductDetails={(p) => setSelectedProduct(p)}
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

      {/* 5. Elegant Detailed specifications modal popup portal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onInstantInquire={handleQuoteSelection}
      />

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
                  placeholder="아이디를 입력하세요 (ultfine)"
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
                  placeholder="비밀번호를 입력하세요 (ult269612!)"
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
                    <option value="UN_AGITATION">UN 화학 교반조 탱크</option>
                    <option value="DECK_STS">테라스 & STS 부속 자재</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Image Preset Selector Helper */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-150">
                <span className="text-[11px] font-extrabold text-slate-700 block">장비 이미지 프리셋 선택 (매우 권장)</span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'UG 표준보강형', img: '/src/assets/images/ug_standard_tank_1781660874171.jpg' },
                    { label: 'UD 이중배출형', img: '/src/assets/images/ud_drainage_tank_1781660890538.jpg' },
                    { label: 'UN 화학교반', img: '/src/assets/images/un_agitation_tank_1781660904203.jpg' },
                    { label: '소형 특수형', img: '/src/assets/images/small_pe_tank_1781660919123.jpg' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormImage(preset.img)}
                      className={`text-[9px] font-bold rounded p-1 border text-center transition-all cursor-pointer ${
                        formImage === preset.img 
                          ? 'border-orange-500 bg-orange-50 text-orange-700 font-extrabold' 
                          : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <div className="w-full h-8 bg-slate-150 rounded overflow-hidden mb-1 pointer-events-none">
                        <img src={preset.img} className="w-full h-full object-cover" />
                      </div>
                      {preset.label}
                    </button>
                  ))}
                </div>
                
                {/* Manual Image URL field */}
                <div className="space-y-1 pt-1.5">
                  <label className="text-[10px] font-bold text-slate-500 block">또는 개별 이미지 주소 링크(URL) 직접 입력</label>
                  <input 
                    type="text" 
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-3xs px-3 py-1.5 border border-slate-200 rounded bg-white focus:outline-none"
                    required
                  />
                </div>
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

    </div>
  );
}
