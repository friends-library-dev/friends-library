import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from '../redux/';
import { fetchAudios } from '../redux/audios';

const Home: React.FC = () => {
  const numAudios = useSelector(({ audios }) => Object.values(audios).length);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAudios());
  }, [dispatch]);

  return (
    <View>
      <Text>Hello App {numAudios} audios</Text>
    </View>
  );
};

export default Home;
