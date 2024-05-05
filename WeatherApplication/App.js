import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';

const API_KEY = 'c00e472f4fc54c0693b80206240602';
const CITY_NAME = 'Colombo';

const WeatherScreen = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [showForecast, setShowForecast] = useState(false);
  const slideAnimation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${CITY_NAME}&aqi=no`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
    }
  };

  const fetchForecast = async () => {
    try {
      const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${CITY_NAME}&days=3`);
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      const data = await response.json();
      setForecast(data);
    } catch (error) {
      console.error('Error fetching forecast data:', error.message);
    }
  };

  const toggleForecast = () => {
    setShowForecast(!showForecast);
    if (!showForecast && !forecast) {
      fetchForecast();
    }
    Animated.timing(slideAnimation, {
      toValue: showForecast ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const getWeatherSuggestion = () => {
    if (!weather) return '';
    if (weather.current.condition.text.toLowerCase().includes('rain')) {
      return 'Don\'t forget your umbrella!';
    }
    return '';
  };

  if (!weather) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const temperature = weather.current.temp_c;

  return (
    <View style={[styles.container, { backgroundColor: '#010C33' }]}>
      <View style={styles.contentContainer}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Weather in <Text style={{ fontWeight: 'bold' }}>Colombo, Sri Lanka</Text></Text>
        </View>
        <View style={styles.line} />
        <View style={styles.frame}>
          <View style={styles.leftContent}>
            <Text style={[styles.temperature, { fontWeight: 'bold', fontSize: 32, color: '#ffffff' }]}>{temperature}<Text style={{ fontWeight: 'normal', fontSize: 24 }}>°C</Text></Text>
            <Text style={[styles.weatherCondition, { fontWeight: 'bold', marginBottom: 10, color: '#ffffff' }]}>{weather.current.condition.text}</Text>
            <Image source={{ uri: `http:${weather.current.condition.icon}` }} style={styles.weatherIcon} />
          </View>
          <View style={styles.rightContent}>
            <Text style={[styles.weatherDetailText, { color: '#ffffff', textAlign: 'center' }]}>Wind: {weather.current.wind_kph} km/h</Text>
            <Text style={[styles.weatherDetailText, { color: '#ffffff', textAlign: 'center' }]}>Humidity: {weather.current.humidity}%</Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleForecast} style={styles.forecastButton}>
          <Text style={styles.forecastButtonText}>{showForecast ? 'Hide 3-Day Forecast' : 'View 3-Day Forecast'}</Text>
        </TouchableOpacity>
        {showForecast && forecast && (
          <Animated.View style={[styles.forecastContainer, { transform: [{ translateY: slideAnimation.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) }] }]}>
            <Text style={styles.forecastText}>3-Day Forecast:</Text>
            {forecast.forecast.forecastday.slice(0, 3).map((day, index) => (
              <View key={index} style={styles.forecastItem}>
                <Text style={styles.forecastDate}>{day.date}</Text>
                <Image source={{ uri: `http:${day.day.condition.icon}` }} style={styles.forecastIcon} />
                <Text style={styles.forecastCondition}>{day.day.condition.text}</Text>
                <Text style={styles.forecastTemp}>Max: {day.day.maxtemp_c}°C</Text>
                <Text style={styles.forecastTemp}>Min: {day.day.mintemp_c}°C</Text>
              </View>
            ))}
          </Animated.View>
        )}
        <Text style={styles.suggestionText}>{getWeatherSuggestion()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#ffffff',
  },
  line: {
    height: 2,
    backgroundColor: '#ffffff',
    width: '100%',
    marginBottom: 10,
  },
  frame: {
    flexDirection: 'row',
    borderRadius: 10,
    width: '100%',
    padding: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(224, 224, 224, 0.5)',
  },
  leftContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherCondition: {
    fontSize: 18,
  },
  temperature: {
    marginBottom: 10,
  },
  weatherDetailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  weatherIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  forecastButton: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  forecastButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forecastContainer: {
    backgroundColor: 'rgba(240, 248, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
  },
  forecastText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  forecastItem: {
    marginBottom: 20,
    alignItems: 'center',
  },
  forecastDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  forecastIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  forecastCondition: {
    fontSize: 16,
    marginBottom: 5,
  },
  forecastTemp: {
    fontSize: 14,
  },
  suggestionText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ffffff',
  },
});

export default WeatherScreen;