"use client";

import { useState, useEffect } from "react";

export default function ContactSection() {
  //const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Only render dynamic content after mount
  }, []);

//  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//    e.preventDefault();
//    setStatus("loading");
//
//    //const data = Object.fromEntries(new FormData(e.currentTarget));
//
//    // ➜ Intégrer EmailJS OU fetch('/api/contact', {method:"POST", body:JSON.stringify(data)})
//    await new Promise((r) => setTimeout(r, 1500)); // démo
//
//    setStatus("sent");
//    e.currentTarget.reset();
//  };

  if (!isMounted) {
    return null; // Prevent rendering on server
  }

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900/40">
      <h2 className="mb-8 text-center text-3xl font-bold">Contactez-nous</h2>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        {/* Form */}
        
      
        {/* Coordonnées + carte */}
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            <strong>Téléphone :</strong> <a href="tel:5142223444">(438) 476-9456</a>
          </p>
          <p>
            <strong>Courriel :</strong>{" "}
            <a href="mailto:effitaxes@gmail.com">effitaxes@gmail.com</a>
          </p>
          <p>
            <strong>Adresse :</strong> 9700 Boulv Saint-Michel, Montréal, QC
          </p>

        </div>
      </div>
    </section>
  );
}