import gspread
from google.oauth2.service_account import Credentials

credentials_file_path = './credentials.json'
range_to_set = 'B2:E26'
value_to_set = '?'
sheet_id = '1_ESG0vd1V_rNmS7EyLEDp5DOtTXIxPskzqxQbPlPa2g'

credentials = Credentials.from_service_account_file(credentials_file_path, scopes=['https://www.googleapis.com/auth/spreadsheets'])
gc = gspread.authorize(credentials)
worksheet = gc.open_by_key(sheet_id).sheet1

cell_list = worksheet.range(range_to_set)
for cell in cell_list:
    cell.value = value_to_set
worksheet.update_cells(cell_list)

print("Range", range_to_set, "in the Google Sheet has been set to '"+value_to_set+"'.")