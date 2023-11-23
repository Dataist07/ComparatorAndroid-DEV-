import { useNavigation } from "@react-navigation/native";
import {View, Text, StyleSheet,SafeAreaView,Button } from "react-native";
import { useEffect, useState } from "react";
import SearchProductSupermarketFiltered from "./SearchProductStack/SearchProductSupermarketFiltered";
import { StatusBar } from 'expo-status-bar';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import axios from 'axios';


const SearchProducts = ({ route }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation();
  const { paramKey } = route.params;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
  }, [data]);

  const fetchData = async () => {
    const fetchDataPromises = paramKey.map(async (nomDrive) => {
      console.log(nomDrive);
      const url = `https://bubu0797.pythonanywhere.com/api/${nomDrive}/product/`;
      const response = await axios.get(url);
      
      const data = response.data;
      
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
        {paramKey.map((nomDrive, index) => (
          
          <Text key={index}>
            {nomDrive}
            
          </Text>
          
        ))}
        
        {loading ? (
          <Text>Loading ....</Text>
        ) : (
          <>
            <SearchProductSupermarketFiltered data={data}/>
          </>
        )}
      </SafeAreaView>
    
  );
};
 const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 10,
    justifyContent: 'flex-start',
    height: '100%',
  },
  ad: {
    flexDirection: 'column',
    height: '0%',
  },
  
});
 export default SearchProducts;