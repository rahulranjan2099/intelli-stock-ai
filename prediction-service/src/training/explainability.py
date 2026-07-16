import shap

import matplotlib.pyplot as plt


def explain_model(model, X_train):

    explainer = shap.TreeExplainer(model)

    shap_values = explainer.shap_values(X_train)

    shap.summary_plot(
        shap_values,
        X_train,
        show=False
    )
    
    plt.tight_layout()

    plt.savefig(
        "output/shap_summary.png",
        dpi=300,
        bbox_inches="tight",
    )

    plt.close()
