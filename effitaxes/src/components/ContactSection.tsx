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

          <iframe
            title="Google Maps – bureau effitaxes"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.1247!2d-73.5734!3d45.5088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDMwJzMyLjAiTiA3M8KwMzQnMjQuOCJX!5e0!3m2!1sfr!2sca!4v1715700000000"
            width="100%"
            height="250"
            loading="lazy"
            className="rounded shadow"
          />
        </div>
      </div>
    </section>
  );
}