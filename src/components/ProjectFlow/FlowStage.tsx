"use client";
import { useState, useRef, useEffect } from "react";
import { Circle } from "@components/ProjectFlow/Circle";

export function FlowStage({
  etapa,
  label,
  labelPosition = "top",
}: {
  etapa: number;
  label: string;
  labelPosition?: "top" | "bottom";
}) {
  const [labelHeight, setLabelHeight] = useState(0);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (labelRef.current) {
      setLabelHeight(labelRef.current.clientHeight);
    }
  }, [label]);

  return (
    <div
      className={`flex ${
        labelPosition === "top" ? "flex-col" : "flex-col-reverse"
      } items-center gap-2`}
    >
      <div style={{ height: `${labelHeight}px` }}></div>
      <Circle
        color={etapa == 1 ? "black" : etapa == 0 ? "white" : "lightgray"}
      />
      <div
        ref={labelRef}
        className={`text-center text-base  ${etapa ? "font-semibold" : ""}`}
      >
        {label}
      </div>
    </div>
  );
}
