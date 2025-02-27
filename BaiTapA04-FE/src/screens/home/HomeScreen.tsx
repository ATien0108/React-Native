import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios'; // Cài axios để gọi API
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const API_URL = 'http://10.0.2.2:8088'; // Địa chỉ API back-end của bạn

const HomeScreen = ({navigation, route}: any) => {
  const {email} = route.params;
  const [categories, setCategories] = useState<any[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<any[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [priceProducts, setPriceProducts] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');

  useEffect(() => {
    fetchCategories(); // Lấy danh mục
    fetchTopSellingProducts(); // Lấy sản phẩm bán chạy
    fetchProductsByPrice(page); // Fetch sản phẩm theo giá sắp xếp tăng dần
  }, []);

  const handleLogout = () => {
    navigation.navigate('LoginScreen');
  };

  // Fetch danh mục từ API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data); // Cập nhật danh sách danh mục
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch sản phẩm bán chạy từ API
  const fetchTopSellingProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/top-selling`);
      setTopSellingProducts(response.data); // Cập nhật danh sách sản phẩm bán chạy
    } catch (error) {
      console.error('Error fetching top selling products:', error);
    }
  };

  // Fetch sản phẩm theo danh mục
  const fetchProducts = async (categoryId: string) => {
    console.log(categoryId); // Đảm bảo categoryId được truyền đúng
    try {
      const response = await axios.get(
        `${API_URL}/api/products/category/${categoryId}`,
      );
      setCategoryProducts(response.data); // Cập nhật sản phẩm theo danh mục
    } catch (error) {
      console.error('Error fetching products by category:', error);
    }
  };

  // Fetch sản phẩm theo giá và phân trang
  // Sửa hàm fetchProductsByPrice
  const fetchProductsByPrice = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/products/sorted?page=${page}`,
      );
      setPriceProducts(prevProducts => [
        ...prevProducts,
        ...response.data, // Thêm dữ liệu mới vào danh sách cũ
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sorted products:', error);
      setLoading(false);
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
      {/* Header */}
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
          />
        </View>
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProfileEditScreen', {email: email})
            }>
            <FontAwesome name="user-circle" size={50} color="#007aff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Danh mục sản phẩm */}
      <View style={styles.carouselContainer}>
        <Text style={styles.sectionTitle}>Danh mục</Text>
        <FlatList
          data={categories}
          horizontal
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.categoryItem}>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Sản phẩm bán chạy */}
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

      {/* Sản phẩm sắp xếp theo giá */}
      <View style={{flex: 1}}>
        <Text style={styles.sectionTitle}>Sản phẩm có giá giảm dần</Text>
        <FlatList
          data={priceProducts}
          keyExtractor={(item, index) => `${item.id}-${page}-${index}`} // Tạo key duy nhất từ id, page và index
          renderItem={({item}) => (
            <TouchableOpacity style={styles.productItem}>
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

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={handleLogout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Căn giữa các phần tử theo chiều dọc
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
  searchAndAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10, // Thêm khoảng cách giữa search và avatar
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
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
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007aff', // Màu chữ danh mục
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
    elevation: 2, // Hiệu ứng đổ bóng cho sản phẩm
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  productName: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: 'bold',
    color: '#333', // Màu chữ tên sản phẩm
  },
  productPrice: {
    fontSize: 14,
    color: '#007aff', // Màu chữ giá
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333', // Màu tiêu đề phần
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
    color: '#007aff', // Nút logout màu xanh lam
  },
  activityIndicator: {
    paddingVertical: 20,
  },
});

export default HomeScreen;
