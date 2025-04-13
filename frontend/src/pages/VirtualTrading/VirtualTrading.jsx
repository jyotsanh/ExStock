import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const allStockSymbols = [
  'ACLBSL', 'ADBL', 'ADBLD83', 'AHL', 'AHPC', 'AKJCL', 'AKPL', 'ALBSL', 'ALICL', 'ANLB', 'API', 'AVYAN', 'BARUN', 'BBC', 'BEDC', 'BFC', 'BGWT', 'BHDC', 'BHL', 'BHPL', 'BNHC', 'BNL', 'BNT', 'BOKD86', 'BPCL', 'C30MF', 'CBBL', 'CBLD88', 'CCBD88', 'CFCL', 'CGH', 'CHCL', 'CHDC', 'CHL', 'CIT', 'CITY', 'CIZBD86', 'CIZBD90', 'CKHL', 'CLI', 'CMF2', 'CORBL', 'CREST', 'CYCL', 'CZBIL', 'DDBL', 'DHPL', 'DLBS', 'DOLTI', 'DORDI', 'EBL', 'EBLD86', 'EBLEB89', 'EDBL', 'EHPL', 'ENL', 'FMDBL', 'FOWAD', 'GBBD85', 'GBBL', 'GBIME', 'GBLBS', 'GCIL', 'GFCL', 'GHL', 'GIBF1', 'GILB', 'GILBPO', 'GLBSL', 'GLH', 'GMFBS', 'GMFIL', 'GMLI', 'GRDBL', 'GSY', 'GUFL', 'GVL', 'GWFD83', 'H8020', 'HATHY', 'HBL', 'HDHPC', 'HDL', 'HEI', 'HEIP', 'HHL', 'HIDCL', 'HIDCLP', 'HLBSL', 'HLI', 'HPPL', 'HRL', 'HURJA', 'ICFC', 'ICFCD83', 'ICFCD88', 'IGI', 'IHL', 'ILBS', 'ILBSP', 'ILI', 'JBBL', 'JBLB', 'JFL', 'JOSHI', 'JSLBB', 'KBL', 'KBLD89', 'KBSH', 'KDBY', 'KDL', 'KEF', 'KKHC', 'KMCDB', 'KPCL', 'KSBBL', 'KSY', 'LBBL', 'LBBLD89', 'LEC', 'LICN', 'LLBS', 'LSL', 'LSLPO', 'LUK', 'LVF2', 'MAKAR', 'MANDU', 'MATRI', 'MBJC', 'MBL', 'MCHL', 'MDB', 'MEHL', 'MEL', 'MEN', 'MERO', 'MFIL', 'MFLD85', 'MHCL', 'MHL', 'MHNL', 'MKCL', 'MKHC', 'MKHL', 'MKJC', 'MLBBL', 'MLBL', 'MLBS', 'MLBSL', 'MMF1', 'MMKJL', 'MNBBL', 'MNBBLP', 'MNMF1', 'MPFL', 'MSHL', 'MSLB', 'NABBC', 'NABIL', 'NADEP', 'NBBD2085', 'NBF2', 'NBF3', 'NBL', 'NBLD82', 'NESDO', 'NFS', 'NGPL', 'NHDL', 'NHPC', 'NIBD2082', 'NIBD84', 'NIBLGF', 'NIBLSTF', 'NIBSF2', 'NICA', 'NICBF', 'NICFC', 'NICGF2', 'NICL', 'NICLBSL', 'NICSF', 'NIFRA', 'NIL', 'NIMB', 'NIMBPO', 'NLG', 'NLIC', 'NLICL', 'NMB', 'NMB50', 'NMBMF', 'NMFBS', 'NMIC', 'NMLBBL', 'NRIC', 'NRM', 'NRN', 'NSIF2', 'NTC', 'NUBL', 'NWCL', 'NYADI', 'OHL', 'PBD84', 'PBD85', 'PBD88', 'PBLD84', 'PCBL', 'PFL', 'PHCL', 'PMHPL', 'PMLI', 'PPCL', 'PPL', 'PRIN', 'PROFL', 'PRSF', 'PRVU', 'PSF', 'RADHI', 'RAWA', 'RBCL', 'RBCLPO', 'RFPL', 'RHGCL', 'RHPL', 'RIDI', 'RLFL', 'RMF1', 'RMF2', 'RNLI', 'RSDC', 'RURU', 'SADBL', 'SAGF', 'SAHAS', 'SALICO', 'SAMAJ', 'SANIMA', 'SAPDBL', 'SARBTM', 'SBCF', 'SBD87', 'SBI', 'SBID83', 'SBID89', 'SBL', 'SBLD84', 'SCB', 'SCBD', 'SEF', 'SFCL', 'SFEF', 'SFMF', 'SGHC', 'SGIC', 'SHEL', 'SHINE', 'SHIVM', 'SHL', 'SHLB', 'SHPC', 'SICL', 'SIFC', 'SIGS2', 'SIGS3', 'SIKLES', 'SINDU', 'SJCL', 'SJLIC', 'SKBBL', 'SLBBL', 'SLBSL', 'SLCF', 'SMATA', 'SMB', 'SMFBS', 'SMH', 'SMHL', 'SMJC', 'SMPDA', 'SNLI', 'SONA', 'SPC', 'SPDL', 'SPHL', 'SPIL', 'SPL', 'SRLI', 'SSHL', 'STC', 'SWBBL', 'SWMF', 'TAMOR', 'TPC', 'TRH', 'TSHL', 'TVCL', 'UAIL', 'UHEWA', 'ULBSL', 'ULHC', 'UMHL', 'UMRH', 'UNHPL', 'UNL', 'UNLB', 'UPCL', 'UPPER', 'USHEC', 'USHL', 'USLB', 'VLBS', 'VLUCL', 'WNLB'
];
export default function LiveStockTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.100.88:8015/ws/v2');

    socket.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);
        if (!Array.isArray(rawData)) return;

        const filteredData = rawData.filter(item =>
          allStockSymbols.includes(item.symbol?.toUpperCase())
        );

        const formattedData = filteredData.map(item => ({
          symbol: item.symbol,
          ltp: item.ltp,
          percent_change: item.percent_change,
          open: item.open,
          high: item.high,
          low: item.low,
          qty: item.qty,
          pclose: item.pclose,
          diff: item.diff,
          timestamp: new Date().toISOString()
        }));

        setData(formattedData);
        setLoading(false); // Data received
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
        setLoading(false); // Also stop loading on error
      }
    };

    return () => socket.close();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Live NEPSE Stock Data</h1>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-700 text-white">
          <thead className="bg-gray-800">
            <tr>
              <th className="border border-gray-700 px-2 py-1">Symbol</th>
              <th className="border border-gray-700 px-2 py-1">LTP</th>
              <th className="border border-gray-700 px-2 py-1">Change %</th>
              <th className="border border-gray-700 px-2 py-1">Open</th>
              <th className="border border-gray-700 px-2 py-1">High</th>
              <th className="border border-gray-700 px-2 py-1">Low</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate(`/${item.symbol.toUpperCase()}`)}
              >
                <td className="border border-gray-700 px-2 py-1">{item.symbol}</td>
                <td className="border border-gray-700 px-2 py-1">{item.ltp}</td>
                <td
                  className={`border border-gray-700 px-2 py-1 ${
                    item.percent_change > 0
                      ? 'text-green-500'
                      : item.percent_change < 0
                      ? 'text-red-500'
                      : 'text-white'
                  }`}
                >
                  {item.percent_change}
                </td>
                <td className="border border-gray-700 px-2 py-1">{item.open}</td>
                <td className="border border-gray-700 px-2 py-1">{item.high}</td>
                <td className="border border-gray-700 px-2 py-1">{item.low}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
