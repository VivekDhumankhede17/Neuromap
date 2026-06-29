"""
Creates a dummy model with the EXACT same architecture as the trained model.
Weights will be random (untrained) — use this only to get the app running.
Replace model/best_model .keras.keras with your real trained model later.
"""

import os
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.regularizers import l2

IMG_SIZE = (224, 224)
NUM_CLASSES = 4

def residual_block(x, filters, stride=1):
    shortcut = x

    # Main path
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.Conv2D(
        filters, 3, strides=stride, padding='same',
        use_bias=False, kernel_regularizer=l2(1e-4)
    )(x)

    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.Conv2D(
        filters, 3, padding='same',
        use_bias=False, kernel_regularizer=l2(1e-4)
    )(x)

    if stride != 1 or shortcut.shape[-1] != filters:
        shortcut = layers.Conv2D(
            filters, 1, strides=stride, padding='same',
            use_bias=False, kernel_regularizer=l2(1e-4)
        )(shortcut)

    x = layers.Add()([x, shortcut])
    return x


def build_model():
    inputs = layers.Input(shape=(IMG_SIZE[0], IMG_SIZE[1], 3))

    # Stem
    x = layers.Conv2D(
        32, 7, strides=2, padding='same',
        use_bias=False, kernel_regularizer=l2(1e-4)
    )(inputs)                                          # 112x112x32
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.MaxPooling2D(3, strides=2, padding='same')(x)  # 56x56x32

    # Stage 1: 56x56
    x = residual_block(x, 64)
    x = residual_block(x, 64)

    # Stage 2: 28x28
    x = residual_block(x, 128, stride=2)
    x = residual_block(x, 128)

    # Stage 3: 14x14
    x = residual_block(x, 256, stride=2)
    x = residual_block(x, 256)

    # Stage 4: 7x7
    x = residual_block(x, 512, stride=2)
    x = residual_block(x, 512)

    # Head
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.40)(x)
    x = layers.Dense(256, activation='relu', kernel_regularizer=l2(1e-4))(x)
    x = layers.Dropout(0.30)(x)
    outputs = layers.Dense(NUM_CLASSES, activation='softmax')(x)

    return tf.keras.Model(inputs, outputs)


print("Building model...")
model = build_model()
model.summary()

# Save to the exact path app.py expects
os.makedirs("model", exist_ok=True)
save_path = "model/best_model .keras.keras"
model.save(save_path)
print(f"\n✅ Dummy model saved to: {save_path}")
print("⚠️  NOTE: This model has RANDOM weights — predictions will be meaningless.")
print("    Replace it with your real trained model after running the notebook.")
