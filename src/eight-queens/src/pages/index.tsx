import Image from 'next/image'
import { Inter } from 'next/font/google'
import React from 'react'
import { ThemeChanger } from '@/components/ThemeProvider'
import Board from "@/components/Board";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">

      <Board size={6}></Board>
    </div>
  )
}
