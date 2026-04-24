import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Baseado nas dimensões do iPhone 11 Pro (largura 375, altura 812)
// Você pode ajustar esses valores para o dispositivo que você usa como referência de design
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale };