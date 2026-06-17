/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Eye, Info, HelpCircle, Edit2, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onQuoteInquire: (productName: string) => void;
  isAdmin?: boolean;
  onEditProduct?: (product: Product, e: React.MouseEvent) => void;
  onDeleteProduct?: (id: string, e: React.MouseEvent) => void;
}

export default function ProductCard({ 
  product, 
  onQuoteInquire, 
  isAdmin, 
  onEditProduct, 
  onDeleteProduct 
}: ProductCardProps) {
  return (
    <div 
      className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden group flex flex-col h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500 hover:shadow-md relative"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-video sm:aspect-square bg-slate-50 overflow-hidden border-b border-slate-100 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        
        {/* New product indicator - disabled per user request */}
        {false && product.isNew && (
          <span className="absolute top-2.5 left-2.5 bg-orange-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-sm uppercase shadow-xs">
            신품
          </span>
        )}

        {/* Category sticker */}
        <span className="absolute bottom-2.5 left-2.5 bg-blue-950/85 text-slate-100 text-[10px] px-2 py-0.5 rounded-sm">
          {product.categoryName}
        </span>

        {/* Admin controls overlay */}
        {isAdmin && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-30">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onEditProduct) onEditProduct(product, e);
              }}
              className="p-1 px-1.5 bg-blue-650 hover:bg-blue-700 text-white rounded text-[10px] transition-all flex items-center gap-1 font-bold shadow-md cursor-pointer"
              title="제품 정보 수정"
            >
              <Edit2 className="w-3 h-3" />
              수정
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDeleteProduct) onDeleteProduct(product.id, e);
              }}
              className="p-1 px-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] transition-all flex items-center gap-1 font-bold shadow-md cursor-pointer"
              title="제품 삭제"
            >
              <Trash2 className="w-3 h-3" />
              삭제
            </button>
          </div>
        )}

        {/* Hover overlay detail indicator */}
        <div className="absolute inset-0 bg-slate-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Corporate spec brief */}
      <div 
        className="p-4 flex flex-col flex-grow justify-between space-y-3.5 cursor-pointer hover:bg-slate-50/50 transition-colors"
        onClick={() => onQuoteInquire(product.name)}
      >
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-sm text-slate-800 tracking-tight line-clamp-2 group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price & Action inquiry row */}
        <div className="flex items-center justify-between pt-1.5 border-t border-dashed border-slate-200">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400">판매 가격</span>
            <span className="text-blue-650 font-bold text-sm flex items-center gap-0.5">
              견적문의
              <Info className="w-3 h-3 text-slate-400 cursor-help" title="주문 사양 타공 여부에 따라 개별 견적이 발행됩니다." />
            </span>
          </div>
          <button 
            className="bg-slate-100 text-slate-600 group-hover:bg-blue-900 group-hover:text-white text-xs font-bold px-2.5 py-1.5 rounded-sm transition-all cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onQuoteInquire(product.name);
            }}
          >
            견적상담
          </button>
        </div>
      </div>
      
    </div>
  );
}
