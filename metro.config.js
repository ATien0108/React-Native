const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const defaultConfig = getDefaultConfig(__dirname); // Chỉnh sửa _dirname thành __dirname
const {assetExts, sourceExts} = defaultConfig.resolver;

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'), // Sử dụng transformer cho SVG
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'), // Loại bỏ 'svg' khỏi các tệp tài nguyên mặc định
    sourceExts: [...sourceExts, 'svg'], // Thêm 'svg' vào danh sách các phần mở rộng nguồn được xử lý
  },
};

module.exports = mergeConfig(defaultConfig, config); // Kết hợp cấu hình mặc định với cấu hình tùy chỉnh
