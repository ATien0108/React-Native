import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';

const API_URL = 'http://10.0.2.2:8088';

const Category = ({navigation, route}: any) => {
  const {email, categoryId} = route.params; // Sử dụng categoryId thay vì brandId
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
  const [ascending, setAscending] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [openSortBy, setOpenSortBy] = useState(false);
  const [openAscending, setOpenAscending] = useState(false);

  useEffect(() => {
    fetchProductsByCategory(categoryId); // Gọi API với categoryId thay vì brandId
  }, [categoryId, sortBy, ascending, page, size]);

  const fetchProductsByCategory = async (categoryId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/products/category/${categoryId}`, // Đường dẫn API với categoryId
        {
          params: {
            page: page,
            size: size,
            sortBy: sortBy,
            ascending: ascending,
          },
        },
      );
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products by category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={{flex: 1, padding: 10}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.notificationContainer}>
          <TouchableOpacity>
            <FontAwesome name="bell" size={30} color="#007aff" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Sản phẩm của thể loại</Text>

      {/* Bộ lọc */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Sắp xếp theo:</Text>
        <DropDownPicker
          open={openSortBy} // Trạng thái mở
          value={sortBy}
          items={[
            {label: 'Ngày', value: 'date'},
            {label: 'Giá', value: 'price'},
          ]}
          containerStyle={[styles.picker, {zIndex: openSortBy ? 999 : 0}]}
          setOpen={setOpenSortBy} // Điều khiển trạng thái mở của dropdown
          setValue={setSortBy} // Cập nhật giá trị
          onChangeValue={(value: 'date' | 'price' | null) =>
            setSortBy(value ?? 'date')
          } // Cập nhật giá trị
        />

        <Text style={styles.filterText}>Thứ tự:</Text>
        <DropDownPicker
          open={openAscending} // Trạng thái mở
          value={ascending}
          items={[
            {label: 'Tăng dần', value: true},
            {label: 'Giảm dần', value: false},
          ]}
          containerStyle={[styles.picker, {zIndex: openAscending ? 999 : 0}]}
          setOpen={setOpenAscending} // Điều khiển trạng thái mở của dropdown
          setValue={setAscending} // Cập nhật giá trị
          onChangeValue={(value: boolean | null) => setAscending(value ?? true)} // Cập nhật giá trị
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProductDetail', {productId: item.id})
              } // Điều hướng đến ProductDetail
            >
              <View style={styles.productItem}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text>{item.discountedPrice} VND</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

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
  },
  notificationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    elevation: 2,
    zIndex: 1,
  },
  filterText: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 40,
    width: '100%',
    marginBottom: 15,
  },
  productItem: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    elevation: 2,
    top: 10,
    zIndex: 0,
  },
  productName: {
    fontSize: 16,
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

export default Category;
