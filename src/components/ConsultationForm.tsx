/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, FileCheck, Search, HelpCircle, HardHat, ShieldCheck, Download, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { Inquiry } from '../types';

interface ConsultationFormProps {
  initialInquiries: Inquiry[];
  onAddInquiry: (inquiry: Inquiry) => void;
  prefilledProduct?: string;
  isAdmin?: boolean;
  onDeleteInquiry?: (id: string) => void;
  onUpdateInquiryStatus?: (id: string, newStatus: '접수대기' | '검토중' | '답변완료') => void;
}

export default function ConsultationForm({ 
  initialInquiries, 
  onAddInquiry, 
  prefilledProduct = '',
  isAdmin = false,
  onDeleteInquiry,
  onUpdateInquiryStatus
}: ConsultationFormProps) {
  
  // Form values
  const [companyName, setCompanyName] = useState('');
  const [picName, setPicName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [productType, setProductType] = useState(prefilledProduct || '케미칼저장탱크 (UG 일반형)');
  const [capacityNeeded, setCapacityNeeded] = useState('');
  const [content, setContent] = useState('');
  const [chemicalType, setChemicalType] = useState('황산 / 질산 / 산독성 약품');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [lastMailtoUrl, setLastMailtoUrl] = useState('');

  // File Upload simulation state
  const [dragActive, setDragActive] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // Inquiry Tracker search state
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Drag Over
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachedFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Manual File Choice
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('개인정보 수집 및 동의에 체크해 주세요.');
      return;
    }

    if (!companyName || !picName || !phone || !email || !content) {
      alert('모든 필수 기재란을 작성해주시기 바랍니다.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const newInquiry: Inquiry = {
        id: `inq-${Math.floor(Math.random() * 900) + 100}`,
        companyName,
        picName,
        phone,
        email,
        productType: `${productType} (${chemicalType} 보관용)`,
        capacityNeeded: capacityNeeded || '상담 후 설계결정',
        content,
        hasDrawings: !!attachedFile,
        drawingFileName: attachedFile ? attachedFile.name : undefined,
        submittedAt: formattedDate,
        status: '접수대기',
      };

      // Generate mailto link
      const emailSubject = `[울트라월드 견적요청] ${companyName} - ${productType}`;
      const emailBody = `주문 및 견적요청서가 다음과 같이 작성되었습니다.
--------------------------------------------------
[의뢰업체 정보]
기업명/회사명 : ${companyName}
담당자명 및 직급 : ${picName}
연락처/전화번호 : ${phone}
이메일 : ${email}

[스펙 및 상담 정보]
희망 용량 : ${capacityNeeded || '상담 후 결정'}
보관 약품 종류 : ${chemicalType}
선택 제품군 : ${productType}
첨부 도면 파일 여부 : ${attachedFile ? `예 (${attachedFile.name})` : '아니오'}

[상세 상담 내용]
${content}
--------------------------------------------------
* 이 메일은 울트라월드 공식 수신 이메일인 ultfine@naver.com 으로 전송됩니다.
`;

      const mailtoUrl = `mailto:ultfine@naver.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      setLastMailtoUrl(mailtoUrl);

      // Open mailto link
      try {
        window.location.href = mailtoUrl;
      } catch (err) {
        console.error('Mail activation failed', err);
      }

      onAddInquiry(newInquiry);
      
      // Reset form variables
      setCompanyName('');
      setPicName('');
      setPhone('');
      setEmail('');
      setCapacityNeeded('');
      setContent('');
      setAttachedFile(null);
      setAgreeTerms(false);
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto w-full bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden" id="consultation-form-view">
      
      <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-5 md:p-6 border-b border-blue-950">
        <h2 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
          <Send className="w-4.5 h-4.5 text-orange-500 animate-pulse" />
          온라인 대형 견적 및 정밀 도면 설계 요청서
        </h2>
        <p className="text-[11px] text-slate-400 mt-1">
          * 필수 기재란을 정확히 입력해주시면 담당 임직원이 확인 후 신속하게 연락을 드려 상세한 단가와 공식 견적서를 송부해 드립니다.
        </p>
      </div>

      {submitSuccess ? (
        <div className="p-8 md:p-12 text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-100">
            <FileCheck className="w-8 h-8" />
          </div>
          
          <div className="space-y-2.5 max-w-md mx-auto">
            <h3 className="font-extrabold text-lg text-slate-900">견적 요청 메일 전송 완료!</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              작성하신 상담 내역이 울트라월드 공식 수신 이메일(<strong className="text-orange-600 font-extrabold">ultfine@naver.com</strong>)로 전송되도록 시스템 메일창이 열렸습니다.
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              혹시 메일함이나 이메일 전송 대화상자가 자동으로 실행되지 않았을 경우, 아래의 <strong className="text-slate-700">"이메일 수동 전송하기"</strong> 버튼을 클릭하여 직접 메일을 발송해주시면 감사하겠습니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xs mx-auto">
            {lastMailtoUrl ? (
              <a 
                href={lastMailtoUrl}
                className="text-xs bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-4.5 py-3 rounded-lg shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
                id="mailto-trigger-btn"
              >
                <Send className="w-3.5 h-3.5 animate-bounce" />
                이메일 수동 전송하기
              </a>
            ) : (
              <a 
                href="mailto:ultfine@naver.com"
                className="text-xs bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-4.5 py-3 rounded-lg shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                이메일 수동 전송
              </a>
            )}
            <button 
              onClick={() => setSubmitSuccess(false)}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-4.5 py-3 rounded-lg cursor-pointer transition-all"
            >
              추가 견적 작성하기
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 text-xs text-slate-700">
          
          {/* Row 1: Company & PIC name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block text-xs">
                업체명 / 회사명 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: 울트라화학공업(주)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block text-xs">
                담당자 성함 및 직급 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: 이재용 과장"
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                className="w-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg"
              />
            </div>
          </div>

          {/* Row 2: Contact & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block text-xs">
                휴대폰 및 연락처 <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="예: 010-3887-6107"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block text-xs">
                이메일 주소 <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="예: buyer@chemical.co.kr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg"
              />
            </div>
          </div>

          {/* Row 3: Product selector & Storage Fluid selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block text-xs">
                문의 대상 제품 카테고리 <span className="text-rose-500">*</span>
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg"
              >
                <option value="케미칼저장탱크 (UG 일반형)">케미칼저장탱크 (UG 일반형)</option>
                <option value="완전배출형 (UD 원추형)">완전배출형 (UD 원추형)</option>
                <option value="교반형 및 모터 부착식 (UN형)">교반형 및 모터 부착식 (UN형)</option>
                <option value="DECK형 안전난간 스틸밴딩">DECK형 안전난간 스틸밴딩</option>
                <option value="특수 주문 제작 복합 탱크">특수 주문 제작 복합 탱크</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block text-xs">
                탱크 보관 예정 물질 종류 <span className="text-rose-500">*</span>
              </label>
              <select
                value={chemicalType}
                onChange={(e) => setChemicalType(e.target.value)}
                className="w-full border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg"
              >
                <option value="황산 / 염산 / 강독성 케미칼">황산 / 염산 / 강독성 케미칼 (특수 두께)</option>
                <option value="수산화나트륨(NaOH) / 알칼리약액">수산화나트륨(NaOH) / 알칼리약액 (일반 두께)</option>
                <option value="수처리 폐수 / 슬러지 / 정화액물질">수처리 폐수 / 슬러지 / 정화액물질</option>
                <option value="농업용 정량 해수 / 염수 보관수조">농업용 정량 해수 / 염수 보관수조</option>
                <option value="일반 정수 / 지하수 / 보조 저수조">일반 정수 / 지하수 / 보조 저수조</option>
              </select>
            </div>
          </div>

          {/* Row 4: Required capacity sizes */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block text-xs">
              희망 수량 및 톤수 사양 <span className="text-slate-400">(상세 기입)</span>
            </label>
            <input
              type="text"
              placeholder="예: 5톤 2대 혹은 20톤 1대"
              value={capacityNeeded}
              onChange={(e) => setCapacityNeeded(e.target.value)}
              className="w-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg"
            />
          </div>

          {/* Content description text area */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block text-xs">
              문의 내용 (상세 조건 / 배관 플랜지 위치 조율) <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              placeholder="예: 하단 배관 2군데 50A 플랜지 용접 요함, 충진 가능한 가이드 안전 사다리가 꼭 필요합니다."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent px-3 py-2.5 rounded-lg placeholder-slate-400 leading-relaxed text-xs"
            />
          </div>

          {/* Drag & Drop Drawing CAD file attach simulator */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block text-xs">
              설계 도면, 탱크 요청 사양 파일 첨부 (Simulation)
            </label>
            <div 
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                dragActive ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200 bg-slate-50'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Download className={`w-8 h-8 ${dragActive ? 'text-amber-505 animate-bounce' : 'text-slate-400'}`} />
                <p className="font-bold text-slate-700 text-2xs md:text-xs">
                  도면 캐드파일(dwg, pdf, jpg)을 이곳에 끌어다 놓거나 클릭하여 선택해주십시오.
                </p>
                <p className="text-[10px] text-slate-400 leading-normal">
                  (배치 도면을 첨부하시면 한층 정밀한 도표 설계와 최종 단가 산정에 매우 큰 도움이 됩니다.)
                </p>
                
                <input
                  type="file"
                  id="sim-file-upload"
                  multiple={false}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label 
                  htmlFor="sim-file-upload"
                  className="mt-2.5 px-3 py-1.5 bg-white border border-slate-250 text-slate-700 font-bold hover:bg-slate-50 text-[11px] rounded shadow-2xs hover:shadow cursor-pointer inline-block"
                >
                  컴퓨터에서 파일 불러오기
                </label>

                {attachedFile && (
                  <div className="mt-4 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-150 text-[11px] font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                    선택 파일: {attachedFile.name} ({(attachedFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terms Consent and Submit */}
          <div className="space-y-4 pt-1.5">
            <label className="flex items-start gap-2.5 text-slate-600 leading-normal cursor-pointer text-2xs select-none">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5"
                id="agree-checkbox"
              />
              <span>
                 울트라월드(주) 약품탱크의 안전 상담 및 견적 송신을 위한 <strong>개인정보 수집 및 자문 이용 동의</strong> (필수)
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-350 text-white font-black py-3 rounded-lg text-sm transition-all text-center flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
              id="consult-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4.5 h-4.5 text-white animate-spin" />
                  견적 세부 요청 내역을 이메일로 발송 준비 중...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  온라인 견적 상담 및 이메일 제출하기 (신속 접수)
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
