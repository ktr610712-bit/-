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

// New high-quality images
import ugOrangeTank from './assets/images/ug_orange_tank_1781680550681.jpg';
import unAgitationTank from './assets/images/un_agitation_tank_1781680565572.jpg';
import stsBandTank from './assets/images/sts_band_tank_1781680585226.jpg';
import deckTypeTank from './assets/images/deck_type_tank_1781680599823.jpg';
import udDrainageTank from './assets/images/ud_drainage_tank_1781660890538.jpg';
import un120WhiteTankNew from './assets/images/un120_white_tank_new_1783494600723.jpg';

/**
 * Resolves static paths to compiled Vite bundled assets or direct public folder paths
 */
export const resolveAssetPath = (pathStr: string): string => {
  if (!pathStr) return '';
  
  // If it's a data URI (base64), blob URL, or external HTTP/HTTPS URL, return it as-is!
  if (
    pathStr.startsWith('data:') || 
    pathStr.startsWith('blob:') || 
    pathStr.startsWith('http://') || 
    pathStr.startsWith('https://')
  ) {
    return pathStr;
  }

  // Extract only the filename from the path to guarantee matching regardless of /src/ or arbitrary prefixes
  let filename = pathStr.substring(pathStr.lastIndexOf('/') + 1);
  // Strip any Vite build hash (e.g. -D8iTWLki before extension)
  filename = filename.replace(/-[a-zA-Z0-9_]{8}\./, '.');
  
  // Return the relative public path directly.
  // This completely avoids ESM/Vite bundler hashing issues and is highly compatible with the proxy.
  return `/assets/images/${filename}`;
};
