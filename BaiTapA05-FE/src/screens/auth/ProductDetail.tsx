import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:8088';

type Specifications = {
  [key: string]: string;
};

type Product = {
  id: string;
  name: string;
  brandId: string;
  categoryId: string;
  originalPrice: number;
  discountedPrice: number;
  description: string;
  specifications: Specifications;
  images: string[];
  videos: string[];
  ratings: {
    average: number;
    totalReviews: number;
  };
  totalSold: number;
};

const ProductDetail = ({navigation, route}: any) => {
  const {productId} = route.params;
  const {email} = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/products/${productId}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!product) {
    return <Text>Product not found</Text>;
  }

  const handleLogout = () => {
    navigation.navigate('LoginScreen');
  };

  const handleAddToCart = () => {
    Alert.alert('Thông báo', 'Sản phẩm đã được thêm vào giỏ hàng!');
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 70}}
        style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.backButton]}>←</Text>
          </TouchableOpacity>
          <View style={styles.notificationContainer}>
            <TouchableOpacity>
              <FontAwesome name="bell" size={30} color="#007aff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Images & Videos */}
        <View style={styles.productMedia}>
          <FlatList
            horizontal
            data={product.images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <Image source={{uri: item}} style={styles.productImage} />
            )}
          />
          <FlatList
            horizontal
            data={product.videos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert('Mở video', 'Mở video: ' + item);
                }}>
                <FontAwesome name="play-circle" size={30} color="#007aff" />
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Product Name and Details */}
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productBrand}>
            Thương hiệu: {product.brandId}
          </Text>

          {/* Ratings */}
          <View style={styles.ratings}>
            {[...Array(5)].map((_, index) => {
              if (index < Math.floor(product.ratings.average)) {
                return (
                  <FontAwesome
                    key={index}
                    name="star"
                    size={20}
                    color="#FFD700"
                  />
                );
              }
              if (
                index === Math.floor(product.ratings.average) &&
                product.ratings.average % 1 !== 0
              ) {
                return (
                  <FontAwesome
                    key={index}
                    name="star-half-o"
                    size={20}
                    color="#FFD700"
                  />
                );
              }
              return (
                <FontAwesome
                  key={index}
                  name="star-o"
                  size={20}
                  color="#FFD700"
                />
              );
            })}
            <Text style={styles.ratingText}>
              {product.ratings.average} ({product.ratings.totalReviews} Đánh
              giá)
            </Text>
          </View>

          {/* Price */}
          <Text style={styles.price}>
            {product.discountedPrice.toLocaleString()} VND
            <Text style={styles.originalPrice}>
              {'  '}
              {product.originalPrice.toLocaleString()} VND
            </Text>
          </Text>

          {/* Description */}
          <View style={styles.specifications}>
            <Text style={styles.specTitle}>Mô tả sản phẩm:</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Specifications */}
          <View style={styles.specifications}>
            <Text style={styles.specTitle}>Thông số kỹ thuật:</Text>
            {Object.keys(product.specifications).map((key, index) => {
              return (
                <Text key={index} style={styles.specItem}>
                  {key}: {product.specifications[key]}
                </Text>
              );
            })}
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('HomeScreen', {email})}>
          <FontAwesome name="home" size={30} color="#007aff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('CartScreen')}>
          <FontAwesome name="shopping-cart" size={30} color="#007aff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('ProfileEditScreen', {email})}>
          <FontAwesome name="user-circle" size={30} color="#007aff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={30} color="#007aff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 5,
  },

  backButton: {
    fontSize: 40,
    color: '#007aff',
  },
  notificationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  productMedia: {
    marginVertical: 20,
  },
  productImage: {
    width: 300,
    height: 200,
    marginRight: 10,
    borderRadius: 8,
  },
  productDetails: {
    padding: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  productBrand: {
    fontSize: 16,
    color: '#007aff',
    marginTop: 5,
  },
  ratings: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#555',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#FF5733',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 18,
  },
  description: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  specifications: {
    marginTop: 15,
  },
  specTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  specItem: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  totalSold: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  addToCartButton: {
    marginTop: 20,
    backgroundColor: '#007aff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 1,
  },
  footerItem: {
    padding: 10,
    fontWeight: '600',
    color: '#007aff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ProductDetail;
