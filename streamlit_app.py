import streamlit as st
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler

# Load the saved model and scaler
model = joblib.load('house_price_model.pkl')
scaler = joblib.load('scaler_price_scaler.pkl')

# Define the exact feature order used during training
FEATURE_ORDER = [
    '24-Hour Security', 'Air Conditioner', 'Badminton Court', 'Balcony',
    'Basketball Court', 'Bath Tub', 'Bathrooms', 'Bbq', 'Bedrooms',
    'Bus Stop', 'Business Centre', 'Cafe', 'Car Slots', 'Clubhouse',
    'District', 'Furnished Type', 'Garage', 'Garden', 'Gym', 'House Type',
    'Jacuzzi', 'Jogging Track', 'Kitchen Cabinet', 'Nursery', 'Parking',
    'Playground', 'Retail Stores', 'Salon', 'Sauna', 'Squash Court',
    'Swimming Pool', 'Tennis Courts', 'Tenure', 'Wading Pool'
]

state_district_mapping = {
    'johor': [
        'ayer hitam', 'batu pahat', 'gelang patah', 'iskandar puteri (nusajaya)', 
        'jeram batu', 'johor bahru', 'kluang', 'kota tinggi', 'kulai', 'labis', 
        'masai', 'muar', 'paloh', 'pasir gudang', 'pekan nenas', 'pengerang', 
        'perling', 'permas jaya', 'pontian', 'sedenak', 'senai', 'serom', 
        'skudai', 'sri gading', 'tampoi', 'tangkak', 'tebrau', 'ulu tiram'
    ],
    'kedah': [
        'alor setar', 'bandar darulaman', 'bedong', 'bukit kayu hitam', 'gurun', 
        'jitra', 'karangan', 'kota kuala muda', 'kuah', 'kuala kedah', 'kuala ketil', 
        'kuala nerang', 'kubang pasu', 'kulim', 'lunas', 'padang meha', 
        'padang serai', 'pokok sena', 'serdang', 'sik', 'sungai karangan', 
        'sungai kob', 'sungai lalang', 'sungai petani', 'temin'
    ],
    'kelantan': [
        'bachok', 'kota bharu', 'machang'
    ],
    'kuala lumpur': [
        'ampang', 'bandar menjalara', 'bandar tasik selatan', 'bangsar', 
        'batu caves', 'brickfields', 'bukit jalil', 'bukit kiara', 
        'bukit tunku (kenny hills)', 'cheras', 'country heights damansara', 
        'damansara heights', 'desa parkcity', 'desa petaling', 'dutamas', 
        'gombak', 'jalan ipoh', 'jalan klang lama (old klang road)', 
        'jalan kuching', 'jinjang', 'kampung kerinchi (bangsar south)', 
        'kepong', 'keramat', 'kl city centre', 'kl eco city', 'kl sentral', 
        'kuchai lama', 'mont kiara', 'pantai', 'salak selatan', 'salak south', 
        'segambut', 'sentul', 'seputeh', 'setapak', 'setiawangsa', 
        'sri hartamas', 'sri petaling', 'sungai besi', 'sunway spk', 
        'taman desa', 'taman tun dr ismail', 'titiwangsa', 'ulu kelang', 
        'wangsa maju'
    ],
    'melaka': [
        'alai', 'alor gajah', 'ayer keroh', 'ayer molek', 'bachang', 
        'balai panjang', 'batu berendam', 'bemban', 'bertam', 'bukit baru', 
        'bukit katil', 'bukit lintang', 'cheng', 'durian tunggal', 'duyong', 
        'jasin', 'klebang', 'krubong', 'masjid tanah', 'melaka city', 
        'merlimau', 'paya rumput', 'selandar', 'semabok', 'sungei baru tengah', 
        'sungei petai', 'tanjong minyak', 'ujong pasir'
    ],
    'negeri sembilan': [
        'bahau', 'bandar enstek', 'bandar sri sendayan', 'bukit kepayang', 
        'jimah', 'kuala pilah', 'labu', 'lenggeng', 'lukut', 'mantin', 'nilai', 
        'pasir panjang', 'port dickson', 'rantau', 'rasah', 'senawang', 
        'seremban', 'seremban 2', 'seremban jaya', 'sikamat', 'teluk kemang'
    ],
    'pahang': [
        'bentong', 'beserah', 'cameron highlands', 'hulu telom', 'karak', 
        'kuantan', 'mentakab', 'muadzam shah', 'pekan', 'penor', 
        'sungai karang', 'temerloh'
    ],
    'penang': [
        'ayer itam', 'balik pulau', 'batu feringghi', 'batu kawan', 
        'batu maung', 'bayan baru', 'bayan lepas', 'bukit jambul', 
        'bukit mertajam', 'bukit minyak', 'butterworth', 'gelugor', 
        'george town', 'gurney', 'jelutong', 'juru', 'kepala batas', 
        'kubang semang', 'nibong tebal', 'perai', 'pulau tikus', 
        'seberang jaya', 'seberang perai', 'simpang ampat', 'sungai ara', 
        'sungai dua', 'sungai jawi', 'tanjung bungah', 'tanjung tokong', 
        'tasek gelugor', 'teluk kumbar'
    ],
    'perak': [
        'bagan serai', 'batu gajah', 'bidor', 'bota', 'chemor', 'gopeng', 
        'ipoh', 'kampar', 'kamunting', 'kuala kangsar', 'kuala kurau', 
        'lahat', 'lumut', 'menglembu', 'parit buntar', 'selama', 
        'seri iskandar', 'simpang', 'simpang pulai', 'sitiawan', 'sungai siput', 
        'taiping', 'tambun', 'tanjong rambutan', 'tanjung malim', 
        'teluk intan', 'tronoh', 'ulu kinta'
    ],
    'perlis': [
        'kangar'
    ],
    'putrajaya': [
        'presint 11', 'presint 18', 'presint 8', 'putrajaya'
    ],
    'sabah': [
        'beaufort', 'kota kinabalu', 'papar', 'penampang', 'sandakan', 
        'tawau', 'tuaran'
    ],
    'sarawak': [
        'bintulu', 'kuching', 'miri', 'samarahan'
    ],
    'selangor': [
        'ampang', 'ara damansara', 'balakong', 'bandar kinrara', 
        'bandar sri damansara', 'bandar sungai long', 'bandar utama', 'bangi', 
        'banting', 'batang berjuntai', 'batu arang', 'batu caves', 
        'beranang', 'bukit raja', 'cheras', 'cyberjaya', 'damansara damai', 
        'damansara perdana', 'dengkil', 'glenmarie', 'gombak', 'hulu langat', 
        'ijok', 'jenjarom', 'kajang', 'kapar', 'kayu ara', 'kepong', 'kerling', 
        'klang', 'kota damansara', 'kuala selangor', 'kuang', 'mutiara damansara', 
        'petaling jaya', 'port klang (pelabuhan klang)', 'puchong', 
        'puchong perdana', 'puncak alam', 'rawang', 'sabak bernam', 
        'saujana', 'saujana utama', 'selayang', 'semenyih', 'sentul', 
        'sepang', 'serendah', 'seri kembangan', 'setia alam', 'shah alam', 
        'subang', 'subang jaya', 'sungai buloh', 'sunway', 'tanjong duabelas', 
        'tanjong karang', 'telok panglima garang', 'tropicana', 'ulu kelang', 
        'ulu langat'
    ],
    'terengganu': [
        'banggul', 'bukit payung', 'dungun', 'kemaman', 'kertih', 
        'kuala paka', 'kuala terengganu'
    ]
}


# Mapping dictionaries
district_mapping = {
    'alai': 0, 'alor gajah': 1, 'alor setar': 2, 'ampang': 3, 'ara damansara': 4,
    'ayer hitam': 5, 'ayer itam': 6, 'ayer keroh': 7, 'ayer molek': 8, 'bachang': 9,
    'bachok': 10, 'bagan serai': 11, 'bahau': 12, 'balai panjang': 13, 'balakong': 14,
    'balik pulau': 15, 'bandar darulaman': 16, 'bandar enstek': 17, 'bandar kinrara': 18,
    'bandar menjalara': 19, 'bandar sri damansara': 20, 'bandar sri sendayan': 21,
    'bandar sungai long': 22, 'bandar tasik selatan': 23, 'bandar utama': 24, 
    'banggul': 25, 'bangi': 26, 'bangsar': 27, 'banting': 28, 'batang berjuntai': 29, 
    'batu arang': 30, 'batu berendam': 31, 'batu caves': 32, 'batu feringghi': 33,
    'batu gajah': 34, 'batu kawan': 35, 'batu maung': 36, 'batu pahat': 37, 
    'bayan baru': 38, 'bayan lepas': 39, 'bedong': 40, 'bekenu': 41, 'bemban': 42,
    'bentong': 43, 'beranang': 44, 'bertam': 45, 'beserah': 46, 'bidor': 47,
    'bota': 48, 'brickfields': 49, 'bukit baru': 50, 'bukit jalil': 51, 'bukit jambul': 52,
    'bukit katil': 53, 'bukit kayu hitam': 54, 'bukit kepayang': 55, 'bukit kiara': 56,
    'bukit lintang': 57, 'bukit mertajam': 58, 'bukit minyak': 59, 'bukit payung': 60,
    'bukit raja': 61, 'bukit tunku (kenny hills)': 62, 'butterworth': 63, 
    'cameron highlands': 64, 'chemor': 65, 'cheng': 66, 'cheras': 67,
    'country heights damansara': 68, 'cyberjaya': 69, 'damansara damai': 70,
    'damansara heights': 71, 'damansara perdana': 72, 'dengkil': 73, 
    'desa parkcity': 74, 'desa petaling': 75, 'dungun': 76, 'durian tunggal': 77,
    'dutamas': 78, 'duyong': 79, 'gelang patah': 80, 'gelugor': 81, 'george town': 82,
    'glenmarie': 83, 'gombak': 84, 'gopeng': 85, 'gurney': 86, 'gurun': 87,
    'hulu langat': 88, 'hulu telom': 89, 'ijok': 90, 'ipoh': 91, 
    'iskandar puteri (nusajaya)': 92, 'jalan ipoh': 93, 'jalan klang lama (old klang road)': 94,
    'jalan kuching': 95, 'jasin': 96, 'jelutong': 97, 'jenjarom': 98, 'jeram batu': 99, 
    'jimah': 100, 'jinjang': 101, 'jitra': 102, 'johor bahru': 103, 'juru': 104,
    'kajang': 105, 'kampar': 106, 'kampung kerinchi (bangsar south)': 107,
    'kamunting': 108, 'kangar': 109, 'kapar': 110, 'karak': 111, 'karangan': 112,
    'kayu ara': 113, 'kemaman': 114, 'kepala batas': 115, 'kepong': 116,
    'keramat': 117, 'kerling': 118, 'kertih': 119, 'kl city centre': 120,
    'kl eco city': 121, 'kl sentral': 122, 'klang': 123, 'klebang': 124, 
    'kluang': 125, 'kota bharu': 126, 'kota damansara': 127, 'kota kinabalu': 128,
    'kota kuala muda': 129, 'kota tinggi': 130, 'krubong': 131, 'kuah': 132, 
    'kuala kangsar': 133, 'kuala kedah': 134, 'kuala ketil': 135, 'kuala kurau': 136,
    'kuala nerang': 137, 'kuala paka': 138, 'kuala pilah': 139, 'kuala selangor': 140, 
    'kuala terengganu': 141, 'kuang': 142, 'kuantan': 143, 'kubang pasu': 144,
    'kubang semang': 145, 'kuchai lama': 146, 'kuching': 147, 'kulai': 148, 
    'kulim': 149, 'labis': 150, 'labu': 151, 'lahat': 152, 'lenggeng': 153, 
    'lukut': 154, 'lumut': 155, 'lunas': 156, 'machang': 157, 'mantin': 158, 
    'masai': 159, 'masjid tanah': 160, 'melaka city': 161, 'menglembu': 162,
    'mentakab': 163, 'merlimau': 164, 'miri': 165, 'mont kiara': 166,
    'muadzam shah': 167, 'muar': 168, 'mutiara damansara': 169, 
    'nibong tebal': 170, 'nilai': 171, 'padang meha': 172, 'padang serai': 173, 
    'paloh': 174, 'pantai': 175, 'papar': 176, 'parit buntar': 177,
    'pasir gudang': 178, 'pasir panjang': 179, 'paya rumput': 180, 
    'pekan': 181, 'pekan nenas': 182, 'penampang': 183, 'pengerang': 184,
    'penor': 185, 'perai': 186, 'perling': 187, 'permas jaya': 188, 
    'petaling jaya': 189, 'pokok sena': 190, 'pontian': 191, 'port dickson': 192, 
    'port klang (pelabuhan klang)': 193, 'presint 11': 194, 'presint 18': 195, 
    'presint 8': 196, 'puchong': 197, 'puchong perdana': 198, 
    'pulau tikus': 199, 'puncak alam': 200, 'putrajaya': 201, 'rantau': 202,
    'rasah': 203, 'rawang': 204, 'sabak bernam': 205, 'salak selatan': 206,
    'salak south': 207, 'samarahan': 208, 'sandakan': 209, 'saujana': 210,
    'saujana utama': 211, 'seberang jaya': 212, 'seberang perai': 213, 
    'sedenak': 214, 'segambut': 215, 'selama': 216, 'selandar': 217, 
    'selayang': 218, 'semabok': 219, 'semenyih': 220, 'senai': 221, 
    'senawang': 222, 'sentul': 223, 'sepang': 224, 'seputeh': 225, 
    'serdang': 226, 'seremban': 227, 'seremban 2': 228, 'seremban jaya': 229, 
    'serendah': 230, 'seri iskandar': 231, 'seri kembangan': 232, 'serom': 233, 
    'setapak': 234, 'setia alam': 235, 'setiawangsa': 236, 'shah alam': 237, 
    'sik': 238, 'sikamat': 239, 'simpang': 240, 'simpang ampat': 241,
    'simpang pulai': 242, 'sitiawan': 243, 'skudai': 244, 'sri gading': 245, 
    'sri hartamas': 246, 'sri petaling': 247, 'subang': 248, 'subang jaya': 249, 
    'sungai ara': 250, 'sungai besi': 251, 'sungai buloh': 252, 'sungai dua': 253, 
    'sungai jawi': 254, 'sungai karang': 255, 'sungai karangan': 256, 
    'sungai kob': 257, 'sungai lalang': 258, 'sungai petani': 259, 
    'sungai siput': 260, 'sungei baru tengah': 261, 'sungei petai': 262, 
    'sunway': 263, 'sunway spk': 264, 'taiping': 265, 'taman desa': 266,
    'taman tun dr ismail': 267, 'tambun': 268, 'tampoi': 269, 'tangkak': 270,
    'tanjong duabelas': 271, 'tanjong karang': 272, 'tanjong minyak': 273, 
    'tanjong rambutan': 274, 'tanjung bungah': 275, 'tanjung malim': 276,
    'tanjung tokong': 277, 'tasek gelugor': 278, 'tawau': 279, 'tebrau': 280,
    'telok panglima garang': 281, 'teluk intan': 282, 'teluk kemang': 283,
    'teluk kumbar': 284, 'temerloh': 285, 'temin': 286, 'titiwangsa': 287,
    'tronoh': 288, 'tropicana': 289, 'tuaran': 290, 'ujong pasir': 291,
    'ulu kelang': 292, 'ulu kinta': 293, 'ulu langat': 294, 'ulu tiram': 295,
    'wangsa maju': 296
}


tenure_mapping = {
    'freehold': 0, 'leasehold': 1, 'malay reserved land': 2, 'private lease scheme': 3
}

furnished_mapping = {
    'fully furnished': 0, 'partly furnished': 1, 'unfurnished': 2
}

house_type_mapping = {
    '1-sty terrace/link house': 0, '1.5-sty terrace/link house': 1, '2-sty terrace/link house': 2,
    '2.5-sty terrace/link house': 3, '3-sty terrace/link house': 4, '3.5-sty terrace/link house': 5,
    '4-sty terrace/link house': 6, '4.5-sty terrace/link house': 7, 'apartment': 8, 'bungalow': 9,
    'cluster house': 10, 'condominium': 11, 'flat': 12, 'semi-detached house': 13,
    'serviced residence': 14, 'townhouse': 15
}

def main():
    st.title("Malaysian House Price Predictor")
    
    # Create a dictionary to store all input values
    input_data = {feature: 0 for feature in FEATURE_ORDER}
    
    st.subheader("Property Details")
    
    # Add state and district filtering
    col1, col2 = st.columns(2)
    
    with col1:
        # State selection
        selected_state = st.selectbox("State", list(state_district_mapping.keys()))
        
        # District selection filtered by state
        districts = state_district_mapping[selected_state]
        selected_district = st.selectbox("District", districts)
        input_data['District'] = district_mapping[selected_district]
        
        # Other property details
        input_data['Bedrooms'] = st.number_input("Number of Bedrooms", min_value=1, max_value=10, value=3)
        input_data['Bathrooms'] = st.number_input("Number of Bathrooms", min_value=1, max_value=10, value=2)
        input_data['Car Slots'] = st.number_input("Number of Car Slots", min_value=0, max_value=10, value=1)
    
    with col2:
        input_data['House Type'] = house_type_mapping[st.selectbox("House Type", list(house_type_mapping.keys()))]
        input_data['Tenure'] = tenure_mapping[st.selectbox("Tenure", list(tenure_mapping.keys()))]
        input_data['Furnished Type'] = furnished_mapping[st.selectbox("Furnished Type", list(furnished_mapping.keys()))]
        size_sqft = st.number_input("Size (sq ft)", min_value=100, value=1000)
    
    st.subheader("Facilities")
    
    # Facilities checkboxes
    facilities = [f for f in FEATURE_ORDER if f not in ['District', 'Bedrooms', 'Bathrooms', 'Car Slots', 
                                                        'House Type', 'Tenure', 'Furnished Type']]
    cols = st.columns(3)
    for idx, facility in enumerate(facilities):
        with cols[idx % 3]:
            input_data[facility] = 1 if st.checkbox(facility) else 0
    
    if st.button("Predict Price"):
        # Create DataFrame with the exact feature order
        input_df = pd.DataFrame([input_data])[FEATURE_ORDER]
        
        # Scale the features
        input_scaled = scaler.transform(input_df)
        
        # Predict price per sqft
        price_per_sqft = model.predict(input_scaled)[0]
        
        # Calculate total price
        total_price = price_per_sqft * size_sqft
        
        # Display results
        st.subheader("Price Prediction")
        col1, col2 = st.columns(2)
        
        with col1:
            st.metric("Predicted Price per sq ft", f"RM {price_per_sqft:.2f}")
        
        with col2:
            st.metric("Total Predicted Price", f"RM {total_price:,.2f}")
        
        # Additional information
        st.info("""
        Note: This prediction is based on historical data and should be used as a reference only.
        Actual property prices may vary based on market conditions and other factors.
        """)

if __name__ == "__main__":
    main()
