import React from 'react'
import HeroSection from '../Component/Hero'
import AboutSection from '../Component/AboutSection'
import ProjectsSection from '../Component/ProjectsSection'
import FooterSection from '../Component/FooterSection'
import ServicesSection from '../Component/ServiceSection'

function Home() {
  return (
    <div>
       <HeroSection/>
       <AboutSection/>
       <ProjectsSection/>
       <ServicesSection/>
       <FooterSection/>

    </div>
  )
}

export default Home