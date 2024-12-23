from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

def load_and_prepare_data():
    """Load and prepare the dataset."""
    df = pd.read_csv('data/cleaned_combined_property_data.csv')
    
    # Create binned columns
    size_bins = [0, 500, 1000, 1500, 2000, 2500, df['Size'].max()]
    size_labels = ['0-500', '501-1000', '1001-1500', '1501-2000', '2001-2500', '2500+']
    df['Size_Bins'] = pd.cut(df['Size'], bins=size_bins, labels=size_labels, include_lowest=True)

    max_price_per_sqft = df['Price per sqft'].max()
    rounded_max_price_per_sqft = np.ceil(max_price_per_sqft / 100) * 100
    bins_sqft = np.linspace(0, rounded_max_price_per_sqft, 6)
    labels_sqft = [f"{int(bins_sqft[i])}-{int(bins_sqft[i + 1])}" for i in range(len(bins_sqft) - 1)]
    df['Price_per_Sqft_Bins'] = pd.cut(df['Price per sqft'], bins=bins_sqft, labels=labels_sqft, include_lowest=True)

    return df

@app.route("/api/correlation-data")
def api_correlation_data():
    df = load_and_prepare_data()
    numerical_df = df.select_dtypes(include=['number']).drop(columns=['Facilities_code'], errors='ignore')
    correlation_matrix = numerical_df.corr().round(3)
    
    return jsonify({
        'matrix': correlation_matrix.to_dict(),
        'columns': correlation_matrix.columns.tolist()
    })

@app.route("/api/scatter-data")
def api_scatter_data():
    df = load_and_prepare_data()
    exclude_columns = [
        'Facilities', 'Price', 'State_code', 'Tenure_code', 'Furnished Type_code', 
        'Facilities_code', 'House Type_code', 'Facilities_list', 'District', 
        'Unnamed: 0', 'District_code', 'Price_per_Sqft_Bins', 'Size_Bins', 'Price per sqft'
    ]
    
    columns_to_plot = [col for col in df.columns if col not in exclude_columns]
    
    max_rows = 500
    sampled_df = df.sample(n=min(max_rows, len(df)), random_state=42)

    scatter_data = {}
    for column in columns_to_plot:
        if column in sampled_df.columns and not sampled_df[column].isnull().all():
            scatter_data[column] = {
                "name": column,
                "x": sampled_df[column].tolist(),
                "y": sampled_df["Price per sqft"].tolist(),
            }

    return jsonify(scatter_data)


@app.route("/api/histogram-data")
def api_histogram_data():
    df = load_and_prepare_data()
    columns_to_plot = [
        col for col in df.columns
        if col not in ['Facilities', 'State_code', 'Tenure_code', 'Furnished Type_code', 
                      'Facilities_code', 'House Type_code']
    ]
    
    histogram_data = {}
    for column in columns_to_plot:
        numeric_column = pd.to_numeric(df[column], errors='coerce').dropna()

        if numeric_column.empty:
            continue

        hist, bin_edges = np.histogram(numeric_column, bins=20)
        histogram_data[column] = {
            'counts': hist.tolist(),
            'bins': bin_edges.tolist(),
            'mean': float(numeric_column.mean()),
            'median': float(numeric_column.median())
        }
    
    return jsonify(histogram_data)


@app.route("/api/bar-data")
def api_bar_data():
    df = load_and_prepare_data()
    categorical_columns = ['State', 'Tenure', 'Furnished Type', 'House Type']
    
    bar_data = {}
    for column in categorical_columns:
        if column in df.columns:
            avg_price = df.groupby(column)['Price per sqft'].agg(['mean', 'count']).round(2)
            formatted_categories = [str(category).title() for category in avg_price.index.tolist()]
            bar_data[column] = {
                'categories': formatted_categories,
                'averages': avg_price['mean'].tolist(),
                'counts': avg_price['count'].tolist()
            }
    
    return jsonify(bar_data)


@app.route("/api/radar-data")
def api_radar_data():
    df = load_and_prepare_data()
    excluded_columns = [
        'Facilities', 'Price', 'State_code', 'Tenure_code', 
        'Furnished Type_code', 'Facilities_code', 'House Type_code', 
        'Facilities_list', 'District', 'District_code', 'Unnamed: 0', 
        'Price_per_Sqft_Bins', 'Size_Bins', 'Size', 'Price per Bedroom',
        'Room Density', 'Price per sqft'
    ]
    
    columns_to_plot = [
        col for col in df.columns if col not in excluded_columns
    ]
    
    radar_data = []
    for column in columns_to_plot:
        stats = df.groupby(column)['Price per sqft'].agg(['min', 'max', 'median', 'mean', 
            lambda x: x.quantile(0.25), lambda x: x.quantile(0.75)]).round(2)
        stats.columns = ['min', 'max', 'median', 'mean', 'q1', 'q3']
        
        for category, row in stats.iterrows():
            radar_data.append({
                'category': str(category).title(),
                'column': column,
                'min': row['min'],
                'max': row['max'],
                'median': row['median'],
                'mean': row['mean'],
                'q1': row['q1'],
                'q3': row['q3'],
            })
    
    return jsonify(radar_data)


@app.route("/api/line-data")
def api_line_data():
    df = load_and_prepare_data()
    excluded_columns = [
        'Price_per_Sqft_Bins', 'Size_Bins', 'District_code', 
        'Room Density', 'Unnamed: 0', 'State_code', 
        'Furnished Type_code', 'House Type_code', 'Tenure_code', 'District', 'Facilities', 'Furnished Type', 'House Type', 'State', 'Tenure'
    ]
    columns_to_plot = [
        col for col in df.columns if col not in excluded_columns and df[col].nunique() > 1
    ]
    
    line_data = {}
    for column in columns_to_plot:
        if df[column].dtype == 'object' or df[column].nunique() < 20:  # Categorical columns
            avg_prices = df.groupby(column)['Price per sqft'].mean().round(2)
            line_data[column] = {
                'x': avg_prices.index.tolist(),
                'y': avg_prices.values.tolist(),
                'name': column
            }
    
    return jsonify(line_data)

@app.route('/predict', methods=['GET'])
def predict():
    # Streamlit app is running on port 8501
    streamlit_url = "http://localhost:8501/"
    return jsonify({"url": streamlit_url})


if __name__ == "__main__":
    app.run(debug=True)