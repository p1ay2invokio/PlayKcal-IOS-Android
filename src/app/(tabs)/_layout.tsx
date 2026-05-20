import { Image } from 'expo-image';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import Icon from "@expo/vector-icons/Ionicons"
import { Text } from 'react-native';

export default function Layout() {
    return (
        <NativeTabs labelStyle={{fontFamily: 'ebold'}} >
            <NativeTabs.Trigger name="home" >
                <NativeTabs.Trigger.Label >Home</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf={'house'} md='home' />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="recap">
                <NativeTabs.Trigger.Label>Overview</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf={'airpods.pro.chargingcase.wireless'} md='home' />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="setting" >
                <NativeTabs.Trigger.Icon sf={'gear'} md='settings' />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}