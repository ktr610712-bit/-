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
  onViewDetails: (product: Product) => void;
  isAdmin?: boolean;
  onEditProduct?: (product: Product, e: React.MouseEvent) => void;
  onDeleteProduct?: (id: string, e: React.MouseEvent) => void;
}

export default function ProductCard({ 
  product, 
  onViewDetails, 
  isAdmin, 
  onEditProduct, 
  onDeleteProduct 
}: ProductCardProps) {
  return (
    <div 
      className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden group flex flex-col h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500 hover:shadow-md cursor-pointer relative"
      onClick={() => onViewDetails(product)}
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-video sm:aspect-square bg-slate-50 overflow-hidden border-b border-slate-100 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        
        {/* New product indicator */}
        {product.isNew && (
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
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
          <div className="bg-white text-slate-900 border border-slate-100 text-xs font-bold px-3 py-1.5 rounded-sm shadow-md flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-200">
            <Eye className="w-3.5 h-3.5 text-orange-500" />
            상세 스펙 보기
          </div>
        </div>
      </div>

      {/* Corporate spec brief */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-3.5">
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            {product.specs.model}
          </p>
          <h3 className="font-bold text-sm text-slate-800 tracking-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Key dimensions and capacity */}
          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">저장 용량</span>
              <strong className="text-slate-700 font-semibold">{product.capacity}</strong>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">외경 규격</span>
              <strong className="text-slate-700 font-semibold">{product.dimensions}</strong>
            </div>
          </div>
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
            className="bg-slate-100 text-slate-600 group-hover:bg-blue-900 group-hover:text-white text-xs font-bold px-2.5 py-1.5 rounded-sm transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
          >
            스펙문의
          </button>
        </div>
      </div>
      
    </div>
  );
}
