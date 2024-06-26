import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Button } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CartProvider, useCart } from './CartContext';
import CartScreen from './CartScreen';

type Produto = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
};

type HomeScreenProps = {
  navigation: any;
};

type DetailsScreenProps = {
  route: any;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(response => {
        setProdutos(response.data);
        setFilteredProdutos(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredProdutos(produtos);
    } else {
      const filtered = produtos.filter(produto =>
        produto.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProdutos(filtered);
    }
  }, [searchQuery, produtos]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Pesquisar produtos"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredProdutos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Detalhes', { item })}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>R${item.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button title="Ver Carrinho" onPress={() => navigation.navigate('Carrinho')} />
    </View>
  );
};

const DetailsScreen: React.FC<DetailsScreenProps> = ({ route }) => {
  const { item } = route.params;
  const { addToCart } = useCart();

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.imageLarge} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>R${item.price.toFixed(2)}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Button title="Adicionar ao Carrinho" onPress={() => addToCart(item)} />
    </View>
  );
};

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Catálogo de Produtos' }} />
          <Stack.Screen name="Detalhes" component={DetailsScreen} options={{ title: 'Detalhes do Produto' }} />
          <Stack.Screen name="Carrinho" component={CartScreen} options={{ title: 'Carrinho de Compras' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#dcdcdc',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  imageLarge: {
    width: '100%',
    height: 300,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
  },
  price: {
    fontSize: 16,
    color: '#ffffff',
  },
  description: {
    fontSize: 14,
    marginTop: 10,
  },
});

export default App;
