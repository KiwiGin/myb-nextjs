"use client";
import { Modal } from "./Modal";
import { NoiceType } from "@/models/noice";
import { Button } from "./ui/button";

interface NoiceProps {
  noice: NoiceType;
}

export function Noice({ noice }: NoiceProps) {
  if (noice.type === "loading") {
    return (
      <div className="absolute  z-50 right-0 top-0 w-lvw h-lvh flex items-center justify-center bg-white">
        <div
          role="status"
          className="flex flex-col justify-center items-center gap-4"
        >
          <svg
            aria-hidden="true"
            className="inline w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
          <span className="ml-2 text-gray-800 dark:text-gray-200">
            {noice.message}
          </span>
        </div>
      </div>
    );
  }

  if (noice.type === "error") {
    return (
      <div className="absolute  z-50 right-0 top-0 w-lvw h-lvh flex items-center justify-center bg-white">
        <div className="bg-white py-10 dark:bg-dark">
          <div className="container">
            <div className="inline-flex rounded-lg bg-red-light-6 px-[18px] py-4 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)]">
              <p className="flex flex-col items-center text-sm font-medium text-[#BC1C21] gap-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.25rem] bg-[#ff4757]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="white"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {noice.message ||
                  "Algo ha salido mal, vuelve a intentarlo luego."}
                <div className="w-2/3 flex flex-col items-center gap-y-2">
                  <Button
                    onClick={() => {
                      window.location.reload();
                    }}
                    variant={"outline"}
                    className="text-black px-4 py-2 rounded-lg w-full"
                  >
                    Volver a intentar
                  </Button>
                  <a className="w-full" href="/">
                    <Button className="text-white bg-red-700 px-4 py-2 rounded-lg w-full">
                      Ir al inicio
                    </Button>
                  </a>
                </div>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (noice.type === "success") {
    return (
      <Modal isOpen={true}>
        <div className="w-lvw h-lvh flex-col items-center justify-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-10 h-10 text-green-500 fill-green-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 0C5.373 0 0 5.373 0 12c0 5.598 3.633 10.338 8.671 12.021.634.115.867-.275.867-.611 0-.3-.012-1.091-.018-2.141-3.531.617-4.275-1.356-4.275-1.356-.578-1.46-1.412-1.849-1.412-1.849-1.154-.787.087-.77.087-.77 1.276.09 1.945 1.311 1.945 1.311 1.131 1.936 2.972 1.375 3.69 1.049.115-.819.445-1.375.809-1.689-2.834-.322-5.806-1.417-5.806-6.301 0-1.392.498-2.53 1.311-3.422-.131-.322-.569-1.619.125-3.375 0 0 1.069-.343 3.5 1.307 1.018-.283 2.1-.425 3.181-.429 1.08.004 2.162.146 3.183.429 2.428-1.65 3.497-1.307 3.497-1.307.695 1.756.258 3.053.127 3.375.814.892 1.309 2.03 1.309 3.422 0 4.895-2.975 5.976-5.816 6.292.457.394.865 1.17.
                865 2.357 0 1.707-.015 3.081-.015 3.501 0 .339.23.733.875.606C20.371 22.332 24 17.592 24 12c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Success</span>
          </div>
        </div>
      </Modal>
    );
  }
}
