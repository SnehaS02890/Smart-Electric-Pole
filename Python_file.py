import firebase_admin
from firebase_admin import credentials, db
import serial

cred = credentials.Certificate(
    "smart-electric-pole-firebase-adminsdk-fbsvc-7b3a12b5de.json"
)

firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://smart-electric-pole-default-rtdb.firebaseio.com/'
})

ref = db.reference("SmartPole")

ser = serial.Serial('COM5', 9600)

while True:
    line = ser.readline().decode().strip()

    print("Received:", line)

    vehicleCount, gasLevel = line.split(',')

    ref.push({
        "vehicleCount": int(vehicleCount),
        "gasLevel": int(gasLevel),
        "status": "HIGH" if int(gasLevel) > 350 else "NORMAL"
    })