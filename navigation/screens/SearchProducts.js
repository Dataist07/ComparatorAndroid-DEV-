import { useNavigation } from "@react-navigation/native";
import {View, Text, StyleSheet,SafeAreaView,Button } from "react-native";
import { useEffect, useState } from "react";
import SearchProductSupermarketFiltered from "./SearchProductStack/SearchProductSupermarketFiltered";
import { StatusBar } from 'expo-status-bar';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-3515253820147436/7984640105';
const SearchProducts = ({ route }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation();
  const { selectedDrives } = route.params;


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
  }, [data]);

  const fetchData = async () => {
    const fetchDataPromises = selectedDrives.map(async ({ nom_drive,nom_driveUrl, dateScraped  }) => {
      console.log(nom_driveUrl);
      const url = `https://bubu0797.pythonanywhere.com/api/${nom_driveUrl}/product/`;
      const response = await axios.get(url);
      
      const data = response.data;
      
      // Store the data locally using AsyncStorage
      await AsyncStorage.setItem(`data_${nom_drive}`, JSON.stringify({ nom_drive, nom_driveUrl, dateScraped, data }));
      
      return data;
    });

    Promise.all(fetchDataPromises)
      .then((result) => {
        setData(result);
        
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));

  };


  return (
    
      <SafeAreaView style={styles.container}>
        {selectedDrives.map(({ nom_drive, dateScraped }, index) => (
          <Text key={index}>
            Nom Drive: {nom_drive}, Date Scraped: {dateScraped}
          </Text>
        ))}

        
        {loading ? (
          <View style={styles.text}>
            <Text>Loading ....</Text>
          </View>
        ) : (
          <>
            <SearchProductSupermarketFiltered data={data}/>
          </>
        )}
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
    flexDirection: 'column',
    padding: 10,
    justifyContent: 'flex-start',
    height: '84%',
  },
  text: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  ad: {
    flex:1,
    flexDirection: 'column',
    height: '0%',
  },
  
});
 export default SearchProducts;