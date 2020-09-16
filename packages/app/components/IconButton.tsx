import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ViewStyle, View, TouchableOpacity } from 'react-native';
import tw from '../lib/tailwind';
import { Sans } from './Text';

interface Props {
  style?: string | ViewStyle;
  icon: string;
  text: string;
  secondaryText?: string;
  bgTailwindClass?: string;
  textTailwindClass?: string;
  onPress: () => any;
}

const IconButton: React.FC<Props> = ({
  style,
  icon,
  text,
  secondaryText,
  bgTailwindClass = `bg-blue-200`,
  textTailwindClass = `text-blue-800`,
  onPress,
}) => (
  <View style={tw(`pb-2 px-4 flex-row justify-center`, style)}>
    <TouchableOpacity
      onPress={onPress}
      style={tw(`${bgTailwindClass} flex-row px-6 py-2 rounded-full`)}
    >
      <Icon name={icon} size={21} style={tw(`pr-2 ${textTailwindClass}`)} />
      <View style={tw(`flex-row`)}>
        <Sans size={15} style={tw(textTailwindClass)}>
          {text}
        </Sans>
        {secondaryText && (
          <Sans size={11} style={tw(textTailwindClass, { marginTop: 3, marginLeft: 5 })}>
            {secondaryText}
          </Sans>
        )}
      </View>
    </TouchableOpacity>
  </View>
);

export default IconButton;
