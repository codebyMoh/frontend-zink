import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

const HomeWallet = () => {
  return (
    <View className='w-full p-2'>
        <View className='p-2'>
            <Text className='font-medium text-lg'>Wallet</Text>
        </View>
        <View className='w-full h-[200px] relative bg-gradient-to-t rounded-2xl from-[#ADFF5A] to-[#78D121]'>
            <View className='absolute w-full h-full justify-end overflow-hidden rounded-2xl'>
                <Image source={require('../../assets/images/home/wallet-balance-chart-bg.webp')}/>
            </View>
            <View className='absolute w-full h-full items-center justify-center flex-row'>
                 <View className='flex-row items-center gap-1'>
                    <Image style={{width: 36, height: 36, marginTop: 4}} source={require('../../assets/images/stable-coin-icon.webp')}/>
                    <View className='flex-row items-end'>
                        <Text className='text-white font-bold text-[48px] leading-[48px]'>0</Text>
                        <Text className='text-white text-2xl ml-1 lead'>.00</Text>
                    </View>
                 </View>
            </View>
            <View className='p-4 items-end'>
                <View className='bg-[#FFFFFF52] w-10 h-10 rounded-full items-center justify-center'>
                    <Image style={{width: 16.5, height: 16.5}} source={require('../../assets/images/qr-code.webp')}/>
                </View>
            </View>
        </View>
        <View className='p-6 gap-4 justify-between flex-row'>
            <View className='items-center w-1/2'>
                <View className='w-11 h-11 bg-[#ACACB03D] rounded-lg items-center justify-center'>
                    <Image style={{width: 20, height: 20}} source={require('../../assets/images/plus.webp')}/>
                </View>
                <Text className='text-[#1E1E20CC] text-sm'>Deposit</Text>
            </View>
            <View className='items-center w-1/2'>
                <View className='w-11 h-11 bg-[#ACACB03D] rounded-lg items-center justify-center'>
                    <Image style={{width: 24, height: 24}} source={require('../../assets/images/qr-code-black.webp')}/>
                </View>
                <Text className='text-[#1E1E20CC] text-sm'>Recieve</Text>
            </View>
        </View>
    </View>
  )
}

export default HomeWallet

const styles = StyleSheet.create({})