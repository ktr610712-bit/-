import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';
import { Product, Inquiry } from './types';
import { PRODUCT_DATA, INITIAL_INQUIRIES } from './data';

const firebaseConfig = {
  apiKey: "AIzaSyABhYgMY6qS2Hu_4Ib1CueAgc9Ojd4RX3E",
  authDomain: "linen-province-pms1d.firebaseapp.com",
  projectId: "linen-province-pms1d",
  storageBucket: "linen-province-pms1d.firebasestorage.app",
  messagingSenderId: "958145330825",
  appId: "1:958145330825:web:c69e720a323543ad8b1058",
  databaseId: "ai-studio-fe9530ea-03b6-49d5-b091-68d8b30695cd"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the custom databaseId if specified
export const db = getFirestore(app, firebaseConfig.databaseId);

// 1. Hero Settings Helpers
interface HeroSettings {
  imageUrl: string;
  badgeText: string;
}

function normalizeImageUrl(url: string, defaultFallback: string): string {
  if (!url) return defaultFallback;
  if (
    url.includes('googleusercontent') ||
    url.includes('google') ||
    (url.startsWith('http') && 
     !url.includes('ultratank.netlify.app') && 
     !url.includes('ais-dev') && 
     !url.includes('ais-pre') && 
     !url.includes('localhost') &&
     !url.includes('vercel.app'))
  ) {
    return defaultFallback;
  }
  return url;
}

export async function getHeroSettings(): Promise<HeroSettings> {
  try {
    const docRef = doc(db, 'settings', 'hero');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        imageUrl: normalizeImageUrl(data.imageUrl, '/assets/images/ug_orange_tank_1781680550681.jpg'),
        badgeText: data.badgeText || 'PE 고강도 보강밴드형 케미칼탱크'
      };
    }
  } catch (err) {
    console.error('Error fetching hero settings from Firestore:', err);
  }
  return {
    imageUrl: '/assets/images/ug_orange_tank_1781680550681.jpg',
    badgeText: 'PE 고강도 보강밴드형 케미칼탱크'
  };
}

export async function saveHeroSettings(imageUrl: string, badgeText: string): Promise<void> {
  try {
    const docRef = doc(db, 'settings', 'hero');
    await setDoc(docRef, { imageUrl, badgeText }, { merge: true });
  } catch (err) {
    console.error('Error saving hero settings to Firestore:', err);
  }
}

// 2. Product Helpers
const defaultProductImages: Record<string, string> = {
  'ug-3000': '/assets/images/ug_orange_tank_1781680550681.jpg',
  'un-mixer': '/assets/images/un_agitation_tank_1781680565572.jpg',
  'sts-band-tank': '/assets/images/sts_band_tank_1781680585226.jpg',
  'deck-type-tank': '/assets/images/deck_type_tank_1781680599823.jpg',
  'ud-drainage-tank': '/assets/images/ud_drainage_tank_1781660890538.jpg',
  'un-120-white-tank': '/assets/images/un120_white_tank_new_1783494600723.jpg',
  'kid-dosing-tank': '/assets/images/kid_dosing_tank_1783488058945.jpg',
  'un-mixed-agitation': '/assets/images/un_mixed_agitation_1783488076632.jpg',
};

export async function getProductsFromDb(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    if (!querySnapshot.empty) {
      const productsList: Product[] = [];
      querySnapshot.forEach((doc) => {
        const product = doc.data() as Product;
        const fallback = defaultProductImages[product.id] || '/assets/images/ug_orange_tank_1781680550681.jpg';
        product.image = normalizeImageUrl(product.image, fallback);
        productsList.push(product);
      });
      return productsList;
    } else {
      // Seed database with default products if empty
      const batch = writeBatch(db);
      PRODUCT_DATA.forEach((product) => {
        const docRef = doc(db, 'products', product.id);
        batch.set(docRef, product);
      });
      await batch.commit();
      return PRODUCT_DATA;
    }
  } catch (err) {
    console.error('Error fetching products from Firestore:', err);
    return PRODUCT_DATA;
  }
}

export async function saveProductToDb(product: Product): Promise<void> {
  try {
    const docRef = doc(db, 'products', product.id);
    await setDoc(docRef, product, { merge: true });
  } catch (err) {
    console.error('Error saving product to Firestore:', err);
  }
}

export async function deleteProductFromDb(productId: string): Promise<void> {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting product from Firestore:', err);
  }
}

// 3. Inquiry Helpers
export async function getInquiriesFromDb(): Promise<Inquiry[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'inquiries'));
    if (!querySnapshot.empty) {
      const inquiriesList: Inquiry[] = [];
      querySnapshot.forEach((doc) => {
        inquiriesList.push(doc.data() as Inquiry);
      });
      // Sort by submittedAt descending or fallback to alphabetical ID
      return inquiriesList.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    } else {
      // Seed database with default inquiries if empty
      const batch = writeBatch(db);
      INITIAL_INQUIRIES.forEach((inquiry) => {
        const docRef = doc(db, 'inquiries', inquiry.id);
        batch.set(docRef, inquiry);
      });
      await batch.commit();
      return INITIAL_INQUIRIES;
    }
  } catch (err) {
    console.error('Error fetching inquiries from Firestore:', err);
    return INITIAL_INQUIRIES;
  }
}

export async function saveInquiryToDb(inquiry: Inquiry): Promise<void> {
  try {
    const docRef = doc(db, 'inquiries', inquiry.id);
    await setDoc(docRef, inquiry, { merge: true });
  } catch (err) {
    console.error('Error saving inquiry to Firestore:', err);
  }
}

export async function deleteInquiryFromDb(inquiryId: string): Promise<void> {
  try {
    const docRef = doc(db, 'inquiries', inquiryId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting inquiry from Firestore:', err);
  }
}

// 4. Custom Preset Helpers
interface CustomPreset {
  id: string;
  label: string;
  url: string;
}

export async function getCustomPresetsFromDb(): Promise<CustomPreset[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'presets'));
    const presetsList: CustomPreset[] = [];
    querySnapshot.forEach((doc) => {
      const preset = doc.data() as CustomPreset;
      // Filter out session-locked developer or Google user-content URLs
      if (preset.url && !preset.url.includes('googleusercontent') && !preset.url.includes('google')) {
        presetsList.push(preset);
      }
    });
    return presetsList;
  } catch (err) {
    console.error('Error fetching custom presets from Firestore:', err);
    return [];
  }
}

export async function saveCustomPresetToDb(preset: CustomPreset): Promise<void> {
  try {
    const docRef = doc(db, 'presets', preset.id);
    await setDoc(docRef, preset, { merge: true });
  } catch (err) {
    console.error('Error saving custom preset to Firestore:', err);
  }
}

export async function deleteCustomPresetFromDb(presetId: string): Promise<void> {
  try {
    const docRef = doc(db, 'presets', presetId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting custom preset from Firestore:', err);
  }
}
