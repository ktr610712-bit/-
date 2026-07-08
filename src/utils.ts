import regImage1 from './assets/images/regenerated_image_1781685239299.png';
import regImage2 from './assets/images/regenerated_image_1781685912943.png';
import regImage3 from './assets/images/regenerated_image_1781685907524.png';
import regImage4 from './assets/images/regenerated_image_1781688139818.png';
import regImage5 from './assets/images/regenerated_image_1781688142077.png';
import uploaded1 from './assets/images/uploaded_tank_1_1781683205180.jpg';
import uploaded2 from './assets/images/uploaded_tank_2_1781683222315.jpg';
import uploaded3 from './assets/images/uploaded_tank_3_1781683237138.jpg';
import uploaded4 from './assets/images/uploaded_tank_4_1781683252954.jpg';
import uploaded5 from './assets/images/uploaded_tank_5_1781683266079.jpg';
import uploaded6 from './assets/images/uploaded_tank_6_1781683278949.jpg';
import uploaded7 from './assets/images/uploaded_tank_7_1781683291987.jpg';
import uploaded8 from './assets/images/uploaded_tank_8_1781683306440.jpg';
import ugStandard from './assets/images/ug_standard_tank_1781660874171.jpg';
import catalogueHero from './assets/images/catalogue_hero_image_1781672372152.jpg';
import unStandardTank from './assets/images/un_standard_tank_1783488042149.jpg';
import kidDosingTank from './assets/images/kid_dosing_tank_1783488058945.jpg';
import unMixedAgitation from './assets/images/un_mixed_agitation_1783488076632.jpg';
import un120WhiteTank from './assets/images/un120_white_tank_1783489320557.jpg';

/**
 * Resolves static paths to compiled Vite bundled assets or direct public folder paths
 */
export const resolveAssetPath = (pathStr: string): string => {
  if (!pathStr) return '';
  // Extract only the filename from the path to guarantee matching regardless of /src/ or arbitrary prefixes
  let filename = pathStr.substring(pathStr.lastIndexOf('/') + 1);
  // Strip any Vite build hash (e.g. -D8iTWLki before extension)
  filename = filename.replace(/-[a-zA-Z0-9_]{8}\./, '.');
  
  const lowerName = filename.toLowerCase();
  
  switch (lowerName) {
    case 'regenerated_image_1781685239299.png': return regImage1;
    case 'regenerated_image_1781685912943.png': return regImage2;
    case 'regenerated_image_1781685907524.png': return regImage3;
    case 'regenerated_image_1781688139818.png': return regImage4;
    case 'regenerated_image_1781688142077.png': return regImage5;
    case 'uploaded_tank_1_1781683205180.jpg': return uploaded1;
    case 'un120_white_tank_1783489320557.jpg': return un120WhiteTank;
    case 'uploaded_tank_2_1781683222315.jpg': return uploaded2;
    case 'uploaded_tank_3_1781683237138.jpg': return uploaded3;
    case 'uploaded_tank_4_1781683252954.jpg': return uploaded4;
    case 'uploaded_tank_5_1781683266079.jpg':
    case 'uploaded_tank_5_1781683266079.png': return uploaded5;
    case 'uploaded_tank_6_1781683278949.jpg':
    case 'uploaded_tank_6_1781683278949.png': return uploaded6;
    case 'uploaded_tank_7_1781683291987.jpg': return uploaded7;
    case 'uploaded_tank_8_1781683306440.jpg':
    case 'uploaded_tank_8_1781683306440.png': return uploaded8;
    case 'ug_standard_tank_1781660874171.jpg': return ugStandard;
    case 'catalogue_hero_image_1781672372152.jpg': return catalogueHero;
    case 'un_standard_tank_1783488042149.jpg': return unStandardTank;
    case 'kid_dosing_tank_1783488058945.jpg': return kidDosingTank;
    case 'un_mixed_agitation_1783488076632.jpg': return unMixedAgitation;
    default: 
      // Safe fallback to static public folder serving which handles .JPG / .PNG and user-uploaded custom files directly
      return `/assets/images/${filename}`;
  }
};
