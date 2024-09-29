import { Inter } from "next/font/google";
import "./globals.css";

import {CrowdFundingProvider} from '../../Context/CrowdFunding'
//import Form from "../../Components/Form";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GFG App",
  description: "Integrating front-end with smart contracts",
};

export default function RootLayout({ children }) {
  return (
    <>
     <html lang="en">
   
   <body className={inter.className}>
    <CrowdFundingProvider>
      <div>


      </div>
  
    {children}
    </CrowdFundingProvider>
   </body>
 </html>

    </>
   
  );
}
