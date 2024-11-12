'use client'

import React from 'react';

export function ImageLoader({
    setBase64,
}: {
    setBase64: (base64: string | null) => void;
}) {
    async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            try {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    if (reader.result && typeof reader.result === 'string') {
                        setBase64(reader.result);
                        const img = new Image();
                        img.src = reader.result;
                        // img.onload = () => {
                        //     setImageMetadata({
                        //         width: img.width,
                        //         height: img.height,
                        //     });
                        // };
                    }
                };
            } catch (error) {
                console.error("Error al cargar la imagen:", error);
            }
        } else {
            setBase64(null);
            // setImageMetadata(null);
        }
    }

    return (
        <div className="flex flex-row">
            <input type="file" className="w-full" onChange={handleImageChange} />
        </div>
    );
}

