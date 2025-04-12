all_stock_symbols = ['GCIL', 'GFCL', 'GHL', 'GIBF1', 'GILB', 'GILBPO', 'GLBSL', 'GLH', 'GMFBS', 'GMFIL', 'GMLI', 'GRDBL', 'GSY', 'GUFL', 'GVL', 
                            'GWFD83', 'H8020', 'HATHY', 'HBL', 'HDHPC', 'HDL', 'HEI', 'HEIP', 'HHL', 'HIDCL', 'HIDCLP', 'HLBSL', 'HLI', 'HPPL', 'HRL', 'HURJA', 
                            'ICFC', 'ICFCD83', 'ICFCD88', 'IGI', 'IHL', 'ILBS', 'ILBSP', 'ILI', 'JBBL', 'JBLB', 'JFL', 'JOSHI', 'JSLBB', 'KBL', 'KBLD89', 
                            'KBSH', 'KDBY', 'KDL', 'KEF', 'KKHC', 'KMCDB', 'KPCL', 'KSBBL', 'KSY', 'LBBL', 'LBBLD89', 'LEC', 'LICN', 'LLBS', 'LSL', 'LSLPO', 
                            'LUK', 'LVF2', 'MAKAR', 'MANDU', 'MATRI', 'MBJC', 'MBL', 'MCHL', 'MDB', 'MEHL', 'MEL', 'MEN', 'MERO', 'MFIL', 'MFLD85', 'MHCL', 
                            'MHL', 'MHNL', 'MKCL', 'MKHC', 'MKHL', 'MKJC', 'MLBBL', 'MLBL', 'MLBS', 'MLBSL', 'MMF1', 'MMKJL', 'MNBBL', 'MNBBLP', 'MND84/85', 
                            'MNMF1', 'MPFL', 'MSHL', 'MSLB', 'NABBC', 'NABIL', 'NADEP', 'NBBD2085', 'NBF2', 'NBF3', 'NBL', 'NBLD82', 'NESDO', 'NFS', 'NGPL', 
                            'NHDL', 'NHPC', 'NIBD2082', 'NIBD84', 'NIBLGF', 'NIBLSTF', 'NIBSF2', 'NICA', 'NICAD85/86', 'NICBF', 'NICFC', 'NICGF2', 'NICL', 
                            'NICLBSL', 'NICSF', 'NIFRA', 'NIL', 'NIMB', 'NIMBPO', 'NLG', 'NLIC', 'NLICL', 'NMB', 'NMB50', 'NMBD87/88', 'NMBMF', 'NMFBS', 
                            'NMIC', 'NMLBBL', 'NRIC', 'NRM', 'NRN', 'NSIF2', 'NTC', 'NUBL', 'NWCL', 'NYADI', 'OHL', 'PBD84', 'PBD85', 'PBD88', 'PBLD84', 
                            'PCBL', 'PFL', 'PHCL', 'PMHPL', 'PMLI', 'PPCL', 'PPL', 'PRIN', 'PROFL', 'PRSF', 'PRVU', 'PSF', 'RADHI', 'RAWA', 'RBCL', 'RBCLPO', 
                            'RFPL', 'RHGCL', 'RHPL', 'RIDI', 'RLFL', 'RMF1', 'RMF2', 'RNLI', 'RSDC', 'RURU', 'SADBL', 'SAGF', 'SAHAS', 'SALICO', 'SAMAJ', 
                            'SANIMA', 'SAPDBL', 'SARBTM', 'SBCF', 'SBD87', 'SBI', 'SBID83', 'SBID89', 'SBL', 'SBLD84', 'SCB', 'SCBD', 'SEF', 'SFCL', 'SFEF', 
                            'SFMF', 'SGHC', 'SGIC', 'SHEL', 'SHINE', 'SHIVM', 'SHL', 'SHLB', 'SHPC', 'SICL', 'SIFC', 'SIGS2', 'SIGS3', 'SIKLES', 'SINDU', 
                            'SJCL', 'SJLIC', 'SKBBL', 'SLBBL', 'SLBSL', 'SLCF', 'SMATA', 'SMB', 'SMFBS', 'SMH', 'SMHL', 'SMJC', 'SMPDA', 'SNLI', 'SONA', 'SPC', 
                            'SPDL', 'SPHL', 'SPIL', 'SPL', 'SRLI', 'SSHL', 'STC', 'SWBBL', 'SWMF', 'TAMOR', 'TPC', 'TRH', 'TSHL', 'TVCL', 'UAIL', 'UHEWA', 
                            'ULBSL', 'ULHC', 'UMHL', 'UMRH', 'UNHPL', 'UNL', 'UNLB', 'UPCL', 'UPPER', 'USHEC', 'USHL', 'USLB', 'VLBS', 'VLUCL', 'WNLB']


from bs4 import BeautifulSoup






import pandas as pd
import pyautogui
import time


def df_to_csv(content,symbol):
    try:
        soup = BeautifulSoup(content, "html.parser")
        table = soup.find("table",class_="table table-bordered table-striped table-hover")
        tr = table.find_all("tr")
        tr = tr[1:]


        date = []
        ltp = []
        percent_change = []
        high = []
        low = []
        open_ = []
        qty = []
        turnover = []

        total_data = {}

        for data in tr:
            date.append(data.find_all("td")[1].text.strip()) # -> date
            ltp.append(data.find_all("td")[2].text.strip()) # -> ltp
            percent_change.append(data.find_all("td")[3].text.strip()) # -> percent_change
            high.append(data.find_all("td")[4].text.strip()) # -> high
            low.append(data.find_all("td")[5].text.strip()) # -> low
            open_.append(data.find_all("td")[6].text.strip()) # -> open
            qty.append(data.find_all("td")[7].text.strip()) # -> qty
            turnover.append(data.find_all("td")[8].text.strip()) # -> turnover

        total_data['date'] = date
        total_data['ltp'] = ltp
        total_data['percent_change'] = percent_change
        total_data['high'] = high
        total_data['low'] = low
        total_data['open'] = open_
        total_data['qty'] = qty
        total_data['turnover'] = turnover
        df = pd.DataFrame(total_data)
        df.to_csv(f"{symbol}.csv",index=False)
        print(f"[{symbol}] -> perfectly to csv")
    except Exception as e:
        print(f"data_extractor_from_html error: {e}")
        print(f"[{symbol}] -> error ------")





from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoAlertPresentException
from selenium.webdriver.common.action_chains import ActionChains
import time

# Set Chrome options to disable notifications
chrome_options = Options()
chrome_options.add_argument("--disable-notifications")

# Initialize the driver with options
driver = webdriver.Chrome(options=chrome_options)

try:
    for stocks in all_stock_symbols:
        # Navigate to the website
        driver.get(f"https://merolagani.com/CompanyDetail.aspx?symbol={stocks}#0")

        
        # Wait for page to load
        time.sleep(3)
        
        # Check for any alerts and handle them
        try:
            WebDriverWait(driver, 5).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            alert.accept()
        except (NoAlertPresentException, TimeoutException):
            pass
        
        # Find and click the price history button
        price_history_full_xpath = "/html/body/form/div[4]/div[6]/div/div/ul/li[4]/a"
        # Optional: wait 2 seconds before starting
        time.sleep(2)

        # Press Enter twice
        pyautogui.press('enter')
        time.sleep(0.2)  # short delay between presses
        pyautogui.press('enter')

        # Wait until the element is clickable
        button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, price_history_full_xpath))
        )
        button.click()
        
        # Wait for the page to load after clicking
        time.sleep(3)
        # Optional: wait 2 seconds before starting
        time.sleep(2)

        # Press Enter twice
        pyautogui.press('enter')
        time.sleep(0.2)  # short delay between presses
        pyautogui.press('enter')

        
        # Add your data extraction code here
        
        html = driver.page_source

        df_to_csv(html,stocks)


        time.sleep(5)
    
except Exception as e:
    print(f"An error occurred: {e}")
    
finally:
    # Close the browser
    driver.quit()