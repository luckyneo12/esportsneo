import {
    ScrollVelocityContainer,
    ScrollVelocityRow,
  } from "@/components/ui/scroll-based-velocity"
  
  const IMAGES_ROW_A = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ]
  
  const IMAGES_ROW_B = [
    "https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ]
  
  export function ScrollBasedVelocityImages() {
    return (
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
        <ScrollVelocityContainer className="w-full">
          <ScrollVelocityRow baseVelocity={6} direction={1} className="py-4">
            {IMAGES_ROW_A.map((src, idx) => (
              <img
                key={idx}
                src={`${src}&ixlib=rb-4.0.3`}
                alt="Esports gaming"
                width={240}
                height={160}
                loading="lazy"
                decoding="async"
                className="mx-4 inline-block h-40 w-60 rounded-lg object-cover shadow-lg hover:shadow-red-500/20 transition-shadow duration-300"
              />
            ))}
          </ScrollVelocityRow>
          <ScrollVelocityRow baseVelocity={6} direction={-1} className="py-4">
            {IMAGES_ROW_B.map((src, idx) => (
              <img
                key={idx}
                src={`${src}&ixlib=rb-4.0.3`}
                alt="Esports gaming"
                width={240}
                height={160}
                loading="lazy"
                decoding="async"
                className="mx-4 inline-block h-40 w-60 rounded-lg object-cover shadow-lg hover:shadow-red-500/20 transition-shadow duration-300"
              />
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
  
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
      </div>
    )
  }
  