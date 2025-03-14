"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { motion } from "framer-motion";
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
  Float,
} from "@react-three/drei";
import { Button } from "./button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

interface ModelProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}
function Model(props: ModelProps) {
  const { scene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf"
  );
  return <primitive object={scene} {...props} />;
}

interface RotatingShapes {
  type: string;
}

function RotatingShape({ type }: RotatingShapes) {
  const ref = useRef<Mesh | null>(null);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.01; // Rotate the shape continuously
  });

  let shape;
  switch (type) {
    case "box":
      shape = <boxGeometry args={[3, 3, 3]} />;
      break;
    case "sphere":
      shape = <sphereGeometry args={[3, 32, 32]} />;
      break;
    case "torus":
      shape = <torusGeometry args={[3, 0.2, 32, 100]} />;
      break;
    case "cone":
      shape = <coneGeometry args={[3, 4, 32]} />;
      break;
    default:
      shape = <boxGeometry args={[1, 1, 1]} />;
  }

  return (
    <mesh ref={ref} scale={1}>
      {shape}
      <meshStandardMaterial color="royalblue" roughness={0.4} />
    </mesh>
  );
}
function CameraRig() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    state.camera.position.y = scrollY * 0.005;

    state.camera.lookAt(1, 10, 0);
  });

  return null;
}

interface Env {
  preset: string;
}

function ShowEnvironment({ preset }: Env) {
  switch (preset) {
    case "sunset":
      return <Environment preset="sunset" background blur={0} />;
    case "dawn":
      return <Environment preset="dawn" background blur={0} />;
    case "night":
      return <Environment preset="night" background blur={0} />;
    case "warehouse":
      return <Environment preset="warehouse" background blur={0} />;
    case "forest":
      return <Environment preset="forest" background blur={0} />;
    case "apartment":
      return <Environment preset="apartment" background blur={0} />;
    case "studio":
      return <Environment preset="studio" background blur={0} />;
    case "city":
      return <Environment preset="city" background blur={0} />;
    case "park":
      return <Environment preset="park" background blur={0} />;
    case "lobby":
      return <Environment preset="lobby" background blur={0} />;
    default:
      return null;
  }
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const RotatingCube = () => {
    const cubeRef = useRef<Mesh | null>(null);

    useFrame(() => {
      if (cubeRef.current) {
        cubeRef.current.rotation.x += 0.01;
        cubeRef.current.rotation.y += 0.01;
      }
    });

    return (
      <mesh ref={cubeRef}>
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color="white" />
      </mesh>
    );
  };

  const [openedEnv, setopendedEnv] = useState<string | null>(null);

  interface HandleEnvClickProps {
    preset: string;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Navigation */}
      <div className="fixed inset-0 z-[-5.1]">
        <Canvas camera={{ position: [0, -10, 5] }}>
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <Float rotationIntensity={0.2} floatIntensity={1}>
            <Model
              scale={0.7}
              position={[10, -0.5, 10]}
              rotation={[0, Math.PI / 9, 0]}
            />
          </Float>
          <Environment preset="park" background />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} />
          <OrbitControls enableZoom={false} />
          <CameraRig />
        </Canvas>
      </div>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-black/60 backdrop-blur-sm py-2" : "py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* <div className="h-8 w-8 rounded-full bg-white"></div> */}
            <Canvas
              className="inset-0"
              style={{ width: "34px", height: "34px" }}
            >
              <ambientLight intensity={0.5} />
              <RotatingCube />
              <directionalLight position={[2, 5, 3]} />
              <OrbitControls enableZoom={false} />
            </Canvas>
            <span className="font-bold text-xl">Threejs</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#" className=" transition-colors">
              Home
            </Link>
            <Link href="#features" className=" transition-colors">
              Features
            </Link>
            <Link href="#showcase" className=" transition-colors">
              Showcase
            </Link>
            <Link href="#services" className=" transition-colors">
              Contact
            </Link>
          </nav>

          <Button className="hidden md:flex bg-black">
            <Link
              href="#features"
              className="text-xl py-2  transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 p-4 flex flex-col bg-black">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Canvas
                className="inset-0"
                style={{ width: "34px", height: "34px" }}
              >
                <ambientLight intensity={0.5} />
                <RotatingCube />
                <directionalLight position={[2, 5, 3]} />
                <OrbitControls enableZoom={false} />
              </Canvas>
              <span className="font-bold text-xl">Threejs</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex flex-col gap-4 mt-8 z-50">
            <Link
              href="#"
              className="text-xl py-2  transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-xl py-2  transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#showcase"
              className="text-xl py-2  transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Showcase
            </Link>
            <Link
              href="#services"
              className="text-xl py-2  transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>

          <Button className="mt-auto mb-8 bg-black border-2 border-white">
            <Link
              href="#features"
              className="text-xl py-2  transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </Button>
        </div>
      )}

      {/* Hero Section with 3D */}
      <section className="relative h-screen flex items-center">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-black">
              Bring Your Ideas to Life in 3D
            </h1>
            <p className="text-lg md:text-xl text-white mb-8">
              Create stunning 3D experiences for the web with our powerful tools
              and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-to-r from-black to-black hover:from-black transition-all text-lg py-6 cursor-pointer">
                <Link
                  href="#features"
                  className="text-xl py-2  transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </Button>
              <Button variant="outline" className="text-lg py-6">
                <Link
                  href="#showcase"
                  className="text-xl py-2  transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  View Showcase
                </Link>
              </Button>
            </div>
          </div>

          <div className="h-[400px] md:h-[500px] w-full">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                intensity={1}
                castShadow
              />
              <Environment preset="city" />
              <Float rotationIntensity={0.2} floatIntensity={0.5}>
                <Model
                  scale={0.7}
                  position={[0, -0.5, 0]}
                  rotation={[0, Math.PI / 5, 0]}
                />
              </Float>
              <ContactShadows
                position={[0, -1.5, 0]}
                opacity={0.4}
                scale={5}
                blur={2.4}
              />
              <OrbitControls enableZoom={false} />
            </Canvas>
          </div>
        </div>
      </section>

      <section className="relative ">
        <div className="text-center w-full h-full px-4">
          <h3 className="text-3xl text-black md:text-5xl font-bold mb-4">
            Want to Explore?
          </h3>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Wait for seconds it will take few time to load Environment
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "sunset",
                bg_img:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvgF9yUTGoqYHUpeBX2EIleyAHJiv59BVxgA&s",
              },
              {
                name: "dawn",
                bg_img: "https://source.unsplash.com/600x400/?dawn",
              },
              {
                name: "night",
                bg_img: "https://source.unsplash.com/600x400/?night",
              },
              {
                name: "warehouse",
                bg_img: "https://source.unsplash.com/600x400/?warehouse",
              },
              {
                name: "forest",
                bg_img: "https://source.unsplash.com/600x400/?forest",
              },
              {
                name: "apartment",
                bg_img: "https://source.unsplash.com/600x400/?apartment",
              },
              {
                name: "studio",
                bg_img: "https://source.unsplash.com/600x400/?studio",
              },
              {
                name: "city",
                bg_img: "https://source.unsplash.com/600x400/?city",
              },
              {
                name: "park",
                bg_img: "https://source.unsplash.com/600x400/?park",
              },
              {
                name: "lobby",
                bg_img: "https://source.unsplash.com/600x400/?lobby",
              },
            ].map((item, index) => (
              <div
                key={item.name}
                className="rounded-lg p-6 bg-black flex gap-8 items-center transition-colors overflow-hidden cursor-pointer"
                onClick={() => setopendedEnv(item.name)}
              >
                <div className="h-12 w-12 rounded-full bg-[#3a558c] flex items-center justify-center">
                  <span className="font-bold text-xl">{index + 1}</span>
                </div>
                <p className="text-gray-400 w-fit">
                  {item.name.toLocaleUpperCase()}
                </p>
              </div>
            ))}
          </div>

          {openedEnv && (
            <div className="fixed top-0 left-0 z-[999] w-screen h-screen transition-all bg-black">
              <div
                className="absolute h-20 w-20 top-20 left-4 z-50 text-white px-4 py-2 rounded cursor-pointer"
                onClick={() => setopendedEnv(null)}
              >
                <img
                  src="https://img.icons8.com/?size=100&id=26191&format=png&color=000000"
                  alt=""
                />
              </div>

              <Canvas
                className="w-full h-full absolute inset-0"
                camera={{ position: [0, 1, 5] }}
              >
                <ambientLight intensity={0.5} />
                <ShowEnvironment preset={openedEnv} />
                <OrbitControls enableZoom />
              </Canvas>
            </div>
          )}
        </div>
      </section>

      <section id="features" className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl text-black md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Everything you need to create stunning 3D experiences for the web
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Interactive 3D Models",
                description:
                  "Import and display interactive 3D models with realistic lighting and shadows.",
              },
              {
                title: "Animation System",
                description:
                  "Create smooth animations and transitions to bring your 3D scenes to life.",
              },
              {
                title: "Physics Engine",
                description:
                  "Add realistic physics to your 3D objects for more immersive experiences.",
              },
              {
                title: "VR & AR Ready",
                description:
                  "Create virtual and augmented reality experiences with just a few lines of code.",
              },
              {
                title: "Performance Optimized",
                description:
                  "Highly optimized rendering for smooth performance across all devices.",
              },
              {
                title: "Easy Integration",
                description:
                  "Seamlessly integrate with your existing web projects and frameworks.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className=" rounded-lg p-6 bg-black transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-[#3a558c] mb-4 flex items-center justify-center">
                  <span className="font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 z-50">
            <h2 className="text-3xl text-black md:text-5xl font-bold mb-4">
              Threejs Showcase
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Check out some of the amazing shapes created with 3D tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 1, title: "AI Cube", shape: "box" },
              { id: 2, title: "Tech Sphere", shape: "sphere" },
              { id: 3, title: "Cyber Torus", shape: "torus" },
              { id: 4, title: "Neon Cone", shape: "cone" },
              { id: 5, title: "Future Box", shape: "box" },
              { id: 6, title: "Glowing Sphere", shape: "sphere" },
            ].map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-lg aspect-video bg-gray-800"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <Canvas className="absolute inset-0">
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[2, 5, 3]} />
                    <RotatingShape type={item.shape} />
                    <OrbitControls enableZoom={false} />
                  </Canvas>
                  <p className="text-gray-300">Interactive 3D experience</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="services" className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl text-black md:text-5xl font-bold mb-4">
              Three.js Services
            </h2>
            <p className="font-bold text-white">
              Unlock the power of Three.js with our cutting-edge 3D solutions
              for web applications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Interactive 3D Websites",
                desc: "Engage users with dynamic 3D elements and animations.",
              },
              {
                title: "3D Product Visualization",
                desc: "Showcase products with realistic 3D models on your website.",
              },
              {
                title: "Virtual Tours",
                desc: "Create immersive walkthrough experiences for real estate, museums, and more.",
              },
              {
                title: "3D Data Visualization",
                desc: "Transform complex data into interactive 3D graphs and charts.",
              },
              {
                title: "Augmented Reality (AR)",
                desc: "Integrate AR experiences using WebXR and Three.js.",
              },
              {
                title: "Game Development",
                desc: "Develop browser-based 3D games with physics, lighting, and animations.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg aspect-5/2 bg-gray-800"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-xl font-bold text-white ">
                    {service.title}
                  </h3>
                  <p className="text-gray-400">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 border-t relative border-gray-800 "
        style={{
          background: "hsla(0,0%,0%,80%)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 items-center content-center gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Canvas
                  className="inset-0"
                  style={{ width: "34px", height: "34px" }}
                >
                  <ambientLight intensity={0.5} />
                  <RotatingCube />
                  <directionalLight position={[2, 5, 3]} />
                  <OrbitControls enableZoom={false} />
                </Canvas>
                <span className="font-bold text-xl">Threejs</span>
              </div>
              <p className="text-gray-400">
                Creating stunning 3D experiences for the web.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#showcase"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Showcase
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://www.linkedin.com/in/parth-joshi-9ab997306/"
                    target="_blank"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://github.com/ParthJoshi19"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} 3D Studio. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
