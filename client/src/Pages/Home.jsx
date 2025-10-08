import React from 'react'
import HeroSection from '../Component/Hero'
import AboutSection from '../Component/AboutSection'
import ProjectsSection from '../Component/ProjectsSection'
import FooterSection from '../Component/FooterSection'

function Home() {
  return (
    <div>
       <HeroSection/>
       <AboutSection/>
       <ProjectsSection/>
       <FooterSection/>

    </div>
  )
}

export default Home