import React from 'react';
import { View, Text, StyleSheet, FlatList, Button, Image } from 'react-native';
import { useCart } from './CartContext';

const CartScreen: React.FC = () => {
  const { cart, removeFromCart } = useCart();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho de Compras</Text>
      <FlatList
        data={cart}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.itemTextContainer}>
              <Text>{item.title}</Text>
              <Text>Quantidade: {item.quantity}</Text>
              <Text>R${(item.price * item.quantity).toFixed(2)}</Text>
              <Button title="Remover" onPress={() => removeFromCart(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
  },
  itemTextContainer: {
    flex: 1,
    paddingLeft: 10,
  },
});

export default CartScreen;
