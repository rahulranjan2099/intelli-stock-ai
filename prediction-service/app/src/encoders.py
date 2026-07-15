import joblib

from sklearn.preprocessing import OrdinalEncoder

from config import (
    ENCODER_PATH,
    CATEGORICAL_COLUMNS,
) 

def fit_encoders(train_df):

    train_df = train_df.copy()

    encoder = OrdinalEncoder(
        handle_unknown="use_encoded_value",
        unknown_value=-1,
    )

    train_df[CATEGORICAL_COLUMNS] = encoder.fit_transform(
        train_df[CATEGORICAL_COLUMNS]
    )

    joblib.dump(
        encoder,
        ENCODER_PATH,
    )

    return train_df

def load_encoder():

    return joblib.load(
        ENCODER_PATH
    )

def transform_dataframe(df):

    df = df.copy()

    encoder = load_encoder()

    df[CATEGORICAL_COLUMNS] = encoder.transform(
        df[CATEGORICAL_COLUMNS]
    )

    return df
