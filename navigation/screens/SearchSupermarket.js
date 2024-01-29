import React, { useEffect, useState } from "react";
import {
  FlatList,
  TextInput,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  Button,
  TouchableOpacity,
  
} from "react-native";


import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';

///screens
const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-3515253820147436/9022389604';

const adInterId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3515253820147436/7665624648';

const interstitial = InterstitialAd.createForAdRequest(adInterId , {
  requestNonPersonalizedAdsOnly: true
});

const SearchSupermarket = ({navigation}) => {

  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const loadInterstitial = () => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setInterstitialLoaded(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setInterstitialLoaded(false);
        interstitial.load();
      }
    );

    interstitial.load();

    return () => {
      unsubscribeClosed();
      unsubscribeLoaded();
    }
  }

  useEffect(() => {
    const unsubscribeInterstitialEvents = loadInterstitial();

    return () => {
      unsubscribeInterstitialEvents();
    };
  }, [])

  

  const url = "https://bubu0797.pythonanywhere.com/api/supermarket/";

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setData(json);
        setOriginalData(json);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const handleItemSelect = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else if (selectedItems.length < 2) {
      setSelectedItems([...selectedItems, item]);
    }
  };


  const handleConfirmSelection = async () => {
    const selectedDrives = selectedItems.map((item) => ({
      nom_drive: item.nom_drive,
      nom_driveUrl: item.nom_driveUrl,
      dateScraped: item.dateScraped,
    }));
    navigation.navigate("Trouvez vos produits", { selectedDrives });
  };
  
  
  
  const resetSelection = () => {
    setSelectedItems([]);
  };

  const filteredData = searchQuery
  ? originalData.filter((item) => {

      const itemDataWithoutAccent = item.city ? item.city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
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

  const resetSearch = () => {
    setSearchQuery('');
  };

  const renderItem = ({ item }) => {
    let imageUri;
    if (item.supermarket === "Carrefour") {
      imageUri =
        "https://upload.wikimedia.org/wikipedia/fr/thumb/3/3b/Logo_Carrefour.svg/1200px-Logo_Carrefour.svg.png";
    } else if (item.supermarket === "Auchan") {
      imageUri =
        "https://logo-marque.com/wp-content/uploads/2021/02/Auchan-Logo.png";
    } else if (item.supermarket === "Leclerc") {
      imageUri =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_E.Leclerc_Sans_le_texte.svg/600px-Logo_E.Leclerc_Sans_le_texte.svg.png";
    } else if (item.supermarket === "Casino") {
      imageUri =
        "https://evoclip.fr/753-large_default/adhesif-logo-grande-distribution-gms-casino-supermarches-rouge-et-vert-fond-blanc.jpg";
    }
    return (
      <Pressable
        style={[
          styles.itemContainer,
          selectedItems.includes(item) && styles.selectedItemContainer,
        ]}
        onPress={() => handleItemSelect(item)}
      >
        <View style={styles.itemContent}>
          <Image source={{ uri: imageUri }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.supermarket}>{item.nom_drive}</Text>

            <View style={styles.columnsLeft}>
              <Text style={styles.city}>{item.city}</Text>
              <Text style={styles.supermarket}>{item.supermarket}</Text>
            </View>

            <View style={styles.columnsRight}>
              <Text style={styles.city}>{"Date maj: "}{item.dateScraped}</Text>
            </View>
            
          </View>
        </View>
        {selectedItems.includes(item) && (
          <AntDesign name="checkcircle" size={24} color="green" />
        )}
      </Pressable>
    );
  };


 
  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.searchContainer}>
        <View></View>
        <TextInput
          style={styles.searchInput}
          placeholder="Code postal ou nom de votre ville"
          onChangeText={(query) => setSearchQuery(query)}
          value={searchQuery}
        />
        <Pressable onPress={resetSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Reset</Text>
        </Pressable>
      </View>
      {loading ? (
        <View style={styles.text}>
          <Text>Loading ....</Text>
        </View>
      ) : searchQuery === '' ? (
        <View style={styles.text}>
          <Text >Commencez à taper dans la barre de recherche pour afficher les supermarchés</Text>
        </View>
        ) : filteredData.length > 0 ?(
          <>
            <FlatList
              data={filteredData}
            
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
            />

            {selectedItems.length > 0 && (
              <View style={styles.selectionContainer}>
                <Button title="Reset" onPress={resetSelection} />
                <Text style={styles.selectionText}>
                  Limite : {selectedItems.length}/2
                </Text>
                
                  <Button title="Choisir" onPress=
                    {() =>{ 
                      //interstitial.show();
                      handleConfirmSelection();
                    }}/> 
                  
              </View>
            )}
          </>
      ) : (
        <View style={styles.text}>
          <Text >Nous n'avons pas trouvé de supermarché dans cette ville </Text>
        </View>
      )}

      
      <BannerAd 
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
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  text: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
   
    
    
  },
  searchContainer: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    flexDirection: 'row'
  },
  searchInput: {
    flex:1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  searchButton:{
    backgroundColor:'#007AFF',
    borderRadius:5,
    marginLeft:10,
    paddingHorizontal:10,
    paddingVertical:5
  },
  searchButtonText:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:16
  },
  itemContainer: {
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
  selectedItemContainer: {
    backgroundColor: "#e6ffe6",
    borderColor: "green",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  itemDetails: {},
  supermarket: {
    fontSize: 18,
    width: 280,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  city: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  selectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f2f2f2",
  },
  selectionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
  },
  columnsRight:{
    width: 200,
  },
  columnsLeft:{
    width: 240,
    
  },
});

export default SearchSupermarket;
