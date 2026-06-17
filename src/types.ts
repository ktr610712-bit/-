/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'ALL' | 'UG_STANDARD' | 'UD_DISCHARGE' | 'UN_AGITATION' | 'DECK_STS';

export interface Product {
  id: string;
  name: string;
  category: Category;
  categoryName: string;
  image: string;
  capacity: string; // e.g. "3,000 L (3톤)"
  dimensions: string; // e.g. "Ø 1,600 x H 1,800"
  features: string[];
  specs: {
    model: string;
    capacity: string;
    diameter: string;
    height: string;
    manhole?: string;
    thickness?: string;
  };
  isNew?: boolean;
}

export interface Inquiry {
  id: string;
  companyName: string;
  picName: string;
  phone: string;
  email: string;
  productType: string;
  capacityNeeded: string;
  content: string;
  chemicalType?: string;
  hasDrawings: boolean;
  drawingFileName?: string;
  submittedAt: string;
  status: '접수대기' | '검토중' | '답변완료';
}
