

import {
  FlatList,
  TextInput,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
} from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decrementQuantity, incrementQuantity, removeFromCart } from "../../../store/CartSlice";
import { useState, useEffect } from "react";
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-3515253820147436/7984640105';
const SearchProductSupermarketFiltered = ({ data }) => {
  const carrefourImage = 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/3b/Logo_Carrefour.svg/1200px-Logo_Carrefour.svg.png';
  const auchanImage = 'https://logo-marque.com/wp-content/uploads/2021/02/Auchan-Logo.png';
  const leclercImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_E.Leclerc_Sans_le_texte.svg/600px-Logo_E.Leclerc_Sans_le_texte.svg.png';
  const casinoImage = 'https://evoclip.fr/753-large_default/adhesif-logo-grande-distribution-gms-casino-supermarches-rouge-et-vert-fond-blanc.jpg'

  const allItems = data.flatMap((items) => items);
  
  const cart = useSelector((state) => state.cart.cart);
  
  const dispatch = useDispatch();
  
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const renderItem = ({ item }) => {
    
    const addItemToCart = (item) => { 
      dispatch(addToCart(item));
    };

    const removeItemFromCart = (item) => {
      dispatch(removeFromCart(item))
    };
    const increaseQuantity = (item) => {
      dispatch(incrementQuantity(item));
    }
    const decreaseQuantity = (item) => {
      if(item.quantity == 1){
        dispatch(removeFromCart(item));
      }else{
        dispatch(decrementQuantity(item));
      }
    }

    let imageUrl;

    // Based on the 'supermarket' attribute, set the appropriate image URL
    if (item.supermarket === 'Carrefour') {
      imageUrl = carrefourImage;
    } else if (item.supermarket === 'Auchan') {
      imageUrl = auchanImage;
    } else if (item.supermarket === 'Leclerc') {
      imageUrl = leclercImage;
    } else if (item.supermarket === 'Casino') {
      imageUrl = casinoImage;
    } else {
      // Set a default image URL if the supermarket attribute is not recognized
      imageUrl = 'https://cdn-icons-png.flaticon.com/512/20/20773.png';
    }

    return (
      
      <View style={styles.item}>
        <View style={styles.columnsLeft}>   
          <Image source={{ uri: imageUrl }} style={styles.imageSupermarket} /> 
          <Image source={{ uri: item.lien_image }} style={styles.image} /> 
        </View>    
         
        <View style={styles.columnMiddle}>
            
            <Text style={styles.name}>{item.nom_produit}</Text>   
        </View>
        
        <View style={styles.columnRight}>
        
            <Text style={styles.price}>{item.prix_produit} €</Text>   
            <Text style={styles.pricePerQuantity}>
              {item.prix_ratio}{" "}
              <Text style={styles.quantityUnit}>{item.unite}</Text>
            </Text>

            {cart.some((value) => value.id == item.id) ? (
            <Pressable onPress={() => removeItemFromCart(item)}>
              <Text style={{
                borderColor:"gray",
                backgroundColor: "grey",
                borderWidth :1,
                marginVertical: 10,
                padding:5,
                width: 60,
                
                  
                }}
              >Retirer</Text>
            </Pressable> 
            ):(
            <Pressable onPress={() => addItemToCart(item)}>
              <Text style={{
                borderColor:"gray",
                backgroundColor: "white",
                borderWidth :1,
                marginVertical: 10,
                padding:5,
                width: 60,
              }}
              >Ajouter</Text>
          </Pressable> 
            )} 
        </View>
        
      </View>
      
    );
  };
  
  const filteredData = searchQuery
  ? allItems.filter((item) => {

      const itemDataWithoutAccent = item.nom_produit ? item.nom_produit.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
      const textParts = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ');
      let shouldIncludeWithoutAccent = true;
      
      for (let i = 0; i < textParts.length; i++) {
        const part = textParts[i];
        shouldIncludeWithoutAccent = shouldIncludeWithoutAccent && (itemDataWithoutAccent.indexOf(part) > -1);
        if (!shouldIncludeWithoutAccent){
          return false;
        }
      }
      return true;
    })
  : [];

  // Sort the data by price_per_quantity
  const sortedData = [...filteredData].sort((a, b) => a.prix_ratio - b.prix_ratio);

  

  return (
    <SafeAreaView>
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.searchBar}
          onChangeText={(query) => setSearchQuery(query)}
          value={searchQuery}
          placeholder="Nom produit"
        />
          {sortedData.length > 0 ? (
            <>
              <FlatList
                data={sortedData}
                
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                estimatedItemSize={300}
              />
            </>
          
          ) : (
            <Text> Produits pas trouvé </Text>
          )}

          
      </SafeAreaView>
        <BannerAd style={styles.ad}
          unitId={adUnitId}
          size={BannerAdSize.FULL_BANNER}
          requestOptions={{
              requestNonPersonalizedAdsOnly: true
          }}
        />
      
    </SafeAreaView>
    
  );
};
const styles = StyleSheet.create({
  container: {

    height: '86%',
    marginVertical: 5,
   
  },
  item: {
   flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },

  columnsLeft:{
    width: 80,
    marginLeft: 2,
    alignItems: "flex-start",
    
  },
  columnMiddle: {
    flex: 1,
    marginLeft: 2,
  },
  columnRight:{       
       
    alignItems: "flex-end",
    marginRight: 2,
  },
  imageSupermarket :{
    width: 30,
    height: 30,
    borderRadius: 2,
    marginRight: 5,
    alignItems: "flex-start",
    
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 8,
    
  },
  
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  
  pricePerQuantity: {
    fontSize: 14,
    color: "#941919",
  },
  quantityUnit: {
    fontSize: 10,
    color: "#941919",
  },
  price: {
    fontSize: 14,
    marginTop: 5,
  },
  supermarket: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
   
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  
});

export default SearchProductSupermarketFiltered;
