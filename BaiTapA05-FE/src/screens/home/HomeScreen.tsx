import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const API_URL = 'http://10.0.2.2:8088';

const HomeScreen = ({navigation, route}: any) => {
  const {email} = route.params;
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<any[]>([]);
  const [priceProducts, setPriceProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchTopSellingProducts();
    fetchProductsByPrice(page);
  }, []);

  const handleLogout = () => {
    navigation.navigate('LoginScreen');
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/brands`);
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchTopSellingProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/top-selling`);
      setTopSellingProducts(response.data);
    } catch (error) {
      console.error('Error fetching top selling products:', error);
    }
  };

  const fetchProductsByPrice = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/products/sorted?page=${page}`,
      );
      setPriceProducts(prevProducts => [...prevProducts, ...response.data]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sorted products:', error);
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigation.navigate('SearchScreen', {keyword: searchQuery, email});
    }
  };

  const handleLoadMore = () => {
    if (!loading) {
      setPage(prevPage => prevPage + 1);
      fetchProductsByPrice(page + 1);
    }
  };

  return (
    <View style={{flex: 1, padding: 10}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton]}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
          />
        </View>
        <View style={styles.notificationContainer}>
          <TouchableOpacity>
            <FontAwesome name="bell" size={30} color="#007aff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.carouselContainer}>
        <Text style={styles.sectionTitle}>Danh mục</Text>
        <FlatList
          data={categories}
          horizontal
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() =>
                navigation.navigate('Category', {categoryId: item.id, email})
              }>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.productContainer}>
        <Text style={styles.sectionTitle}>Top 10 sản phẩm bán chạy</Text>
        <FlatList
          data={topSellingProducts}
          horizontal
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.productItem}>
              <Text style={styles.productName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.carouselContainer}>
        <Text style={styles.sectionTitle}>Thương hiệu</Text>
        <FlatList
          data={brands}
          horizontal
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.brandItem}
              onPress={() =>
                navigation.navigate('Brand', {brandId: item.id, email})
              }>
              <Text style={styles.brandText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={{flex: 1}}>
        <Text style={styles.sectionTitle}>Sản phẩm có giá giảm dần</Text>
        <FlatList
          data={priceProducts}
          keyExtractor={(item, index) => `${item.id}-${page}-${index}`}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.productItem}
              onPress={() => {
                navigation.navigate('ProductDetail', {productId: item.id}); // Navigate to ProductDetail
              }}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productName}>{item.discountedPrice} VND</Text>
            </TouchableOpacity>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
          }
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('Home')}>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    fontSize: 40,
    color: '#007aff',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 10,
  },
  notificationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    marginVertical: 15,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007aff',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007aff',
  },
  productContainer: {
    marginVertical: 15,
  },
  productItem: {
    marginHorizontal: 10,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    elevation: 2,
  },
  productName: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerItem: {
    padding: 10,
    fontWeight: '600',
    color: '#007aff',
  },
});

export default HomeScreen;
