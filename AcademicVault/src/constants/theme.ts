// src/constants/theme.ts

import { Button } from "@react-navigation/elements";


const tintColorLight = '#d20d0dff';
const tintColorDark = '#fff';

export interface ThemeColors{
  primary:string;
  secondary:string;
  bannerText:string;
  text:string;
  subtext:string;
  background:string;
  //forms
  label:string;
  inputbg:string;
  inputstroke:string;
  inputfocused:string;
  button:string;
  altbutton:{bg:string, stroke:string};
  //navigation
  tint:string;
  tabIconDefault:string;
  tabIconSelected:string;
}

export const Colors = {
  light: {
    primary:'#9B7B95',
    secondary:'#604C5F',
    bannerText:'#C6005C',
    text: '#000000',
    subtext:'#45556C',
    background: '#FFFEF5',
    label:'#4A4A4A',
    inputbg:'#ffffff',
    inputstroke:'#E5E7EB',
    inputfocused:'#7b5e77',
    button:'#7B5E77',
    altbutton:{bg:'#7B5E7750',stroke:'#7B5E77'},
    tint: '#eeede4',
    tabIconDefault: '#687076',
    tabIconSelected: "#604C5F",
  },
  dark: {
    primary:'#9B7B95',
    secondary:'#604C5F',  
    bannerText:'#C6005C',  
    text: '#ECEDEE',
    subtext:'#45556C',    
    background: '#151718',
    label:'#4A4A4A',
    inputbg:'#ffffff',
    inputstroke:'#E5E7EB',
    inputfocused:'#7b5e77',
    button:'#7B5E77',
    altbutton:{bg:'#7B5E7750',stroke:'#7B5E77'},    
    tint: tintColorDark,
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export default Colors;