"use client"

import { useEffect, useRef } from "react"

interface AdSpotProps {
  className?: string
  adSlot?: string
  width?: string | number
  height?: string | number
  style?: "display" | "inline" | "banner"
}

export function AdSpot({
  className = "",
  adSlot = "default",
  width = "auto",
  height = "auto",
  style = "display",
}: AdSpotProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This is where you'd initialize Google AdSense
    // For example:
    // try {
    //   (window.adsbygoogle = window.adsbygoogle || []).push({});
    // } catch (err) {
    //   console.error('AdSense error:', err);
    // }

    // For development, we'll just show a placeholder
    if (adRef.current) {
      adRef.current.innerHTML = `
        <div class="text-center text-sm text-muted-foreground">
          Advertisement
        </div>
      `
    }
  }, []) // Removed adSlot from dependencies

  const getAdStyles = () => {
    switch (style) {
      case "display":
        return "min-h-[250px] bg-muted/30"
      case "inline":
        return "min-h-[100px] bg-muted/30"
      case "banner":
        return "min-h-[90px] bg-muted/30"
      default:
        return "min-h-[250px] bg-muted/30"
    }
  }

  return (
    <div
      ref={adRef}
      className={`relative overflow-hidden rounded-lg ${getAdStyles()} ${className}`}
      style={{ width, height }}
      data-ad-slot={adSlot}
    />
  )
}

