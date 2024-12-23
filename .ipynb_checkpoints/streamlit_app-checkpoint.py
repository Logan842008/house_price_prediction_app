import streamlit as st
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the LightGBM model
lgbm_model = joblib.load("lgbm_model.h5")

# Load the cleaned dataset to extract unique values for dropdowns
@st.cache_data
def load_data():
    df = pd.read_csv("data/cleaned_combined_property_data.csv")
    # Capitalize all string columns to ensure title case
    for col in ['State', 'District', 'Tenure', 'Furnished Type', 'House Type']:
        if col in df.columns:
            df[col] = df[col].str.title()
    return df

data = load_data()

# Extract unique values for dropdowns
states = sorted(data["State"].dropna().unique().tolist())
tenures = sorted(data["Tenure"].dropna().unique().tolist())
furnished_types = sorted(data["Furnished Type"].dropna().unique().tolist())
house_types = sorted(data["House Type"].dropna().unique().tolist())

# Define categorical columns
categorical_columns = ["District", "State", "Tenure", "Furnished Type", "House Type"]

# Create a function to get districts for a given state
@st.cache_data
def get_districts(state):
    return sorted(data[data["State"] == state]["District"].dropna().unique().tolist())

# Streamlit app interface
st.title("🏠 Property Price Prediction (LightGBM Only)")

# User input form
st.subheader("Provide Property Details:")
with st.form("prediction_form"):
    # Organize layout into columns for better UI
    col1, col2, col3 = st.columns(3)
    
    with col1:
        bedrooms = st.slider("Bedrooms", min_value=0, max_value=20, value=3)
        bathrooms = st.slider("Bathrooms", min_value=0, max_value=10, value=2)
        car_slots = st.slider("Car Slots", min_value=0, max_value=10, value=1)
    
    with col2:
        size = st.slider("Size (sqft)", min_value=500, max_value=5000, value=1000, step=100)
        state_name = st.selectbox("State", states)
    
    with col3:
        available_districts = get_districts(state_name)
        district_name = st.selectbox("District", available_districts)

    # Static dropdowns for other fields
    tenure_name = st.selectbox("Tenure", tenures)
    furnished_name = st.selectbox("Furnished Type", furnished_types)
    house_name = st.selectbox("House Type", house_types)

    # Features for amenities
    amenities = [
        "24-Hour Security", "Air Conditioner", "Badminton Court", "Balcony", 
        "Basketball Court", "Bath Tub", "Bbq", "Bus Stop", "Business Centre", 
        "Cafe", "Clubhouse", "Garage", "Garden", "Gym", "Jacuzzi", 
        "Jogging Track", "Kitchen Cabinet", "Nursery", "Parking", 
        "Playground", "Retail Stores", "Salon", "Sauna", 
        "Squash Court", "Swimming Pool", "Tennis Courts", "Wading Pool"
    ]
    selected_amenities = st.multiselect("Select Amenities", amenities)

    # Submit button
    submit = st.form_submit_button("Predict Price")

# Prediction
if submit:
    st.write("🛠️ Processing your prediction...")
    
    # Prepare input data
    input_data = pd.DataFrame([{
        "Bedrooms": bedrooms,
        "Size": size,
        "Bathrooms": bathrooms,
        "Car Slots": car_slots,
        "District": district_name,
        "State": state_name,
        "Tenure": tenure_name,
        "Furnished Type": furnished_name,
        "House Type": house_name,
        **{amenity: (1 if amenity in selected_amenities else 0) for amenity in amenities}
    }])
    
    # Ensure categorical columns are marked properly for LightGBM
    for col in categorical_columns:
        input_data[col] = input_data[col].astype('category')
    
    # Make prediction using LightGBM
    lgbm_pred = lgbm_model.predict(input_data)
    
    # Convert prediction back to original scale
    predicted_price = np.expm1(lgbm_pred[0])
    
    # Display prediction
    st.success(f"🎉 Predicted Property Price: **RM{predicted_price:,.2f}**")

# Add combination testing for exploratory analysis
if st.checkbox("🔍 Test Combinations of Size, Bedrooms, and Bathrooms"):
    st.write("Test predictions for varying combinations of Size, Bedrooms, and Bathrooms.")

    # Input ranges for testing
    sizes = st.slider("Range of Sizes (sqft)", 500, 5000, (1000, 2000), step=500)
    bedroom_range = st.slider("Range of Bedrooms", 1, 10, (1, 4), step=1)
    bathroom_range = st.slider("Range of Bathrooms", 1, 5, (1, 3), step=1)

    # Collect predictions for different combinations
    results = []
    for bedrooms in range(bedroom_range[0], bedroom_range[1] + 1):
        for bathrooms in range(bathroom_range[0], bathroom_range[1] + 1):
            for size in range(sizes[0], sizes[1] + 500, 500):
                test_data = pd.DataFrame([{
                    "Bedrooms": bedrooms,
                    "Size": size,
                    "Bathrooms": bathrooms,
                    "Car Slots": car_slots,
                    "District": district_name,
                    "State": state_name,
                    "Tenure": tenure_name,
                    "Furnished Type": furnished_name,
                    "House Type": house_name,
                    **{amenity: (1 if amenity in selected_amenities else 0) for amenity in amenities}
                }])
                
                # Ensure categorical columns are set
                for col in categorical_columns:
                    test_data[col] = test_data[col].astype('category')
                
                # Make predictions
                prediction = lgbm_model.predict(test_data)[0]
                predicted_price = np.expm1(prediction)
                
                results.append({
                    "Bedrooms": bedrooms,
                    "Bathrooms": bathrooms,
                    "Size": size,
                    "Predicted Price": predicted_price
                })
    
    # Convert results to DataFrame
    results_df = pd.DataFrame(results)
    st.write(results_df)

    # Visualize results
    st.write("📊 Visualization of Predicted Prices")
    fig, ax = plt.subplots(figsize=(10, 6))
    sns.lineplot(data=results_df, x="Size", y="Predicted Price", hue="Bedrooms", style="Bathrooms", markers=True, ax=ax)
    plt.title("Price Predictions by Size, Bedrooms, and Bathrooms")
    plt.xlabel("Size (sqft)")
    plt.ylabel("Predicted Price (RM)")
    st.pyplot(fig)
