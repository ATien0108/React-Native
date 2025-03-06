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

const API_URL = 'http://10.0.2.2:8088';

const SearchScreen = ({navigation, route}: any) => {
  const {keyword, email} = route.params;
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const searchProducts = async (keyword: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/products/search`, {
        params: {keyword},
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keyword) {
      searchProducts(keyword);
    }
  }, [keyword]);

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

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={{flex: 1}}>
          {searchResults.length > 0 ? (
            <View style={{marginBottom: 10}}>
              <Text style={styles.resultsText}>
                Kết quả tìm kiếm cho: "{keyword}"
              </Text>
            </View>
          ) : (
            <Text style={{textAlign: 'center', marginTop: 20}}>
              Không có sản phẩm nào phù hợp với từ khóa "{keyword}".
            </Text>
          )}

          <FlatList
            data={searchResults}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.productItem}
                onPress={() => {
                  navigation.navigate('ProductDetail', {productId: item.id});
                }}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text>{item.discountedPrice} VND</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Footer */}
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
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('LoginScreen')}>
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
  productItem: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    elevation: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
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

export default SearchScreen;
