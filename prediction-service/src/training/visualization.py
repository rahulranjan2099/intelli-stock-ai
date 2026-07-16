import matplotlib.pyplot as plt


def plot_actual_vs_predicted(results_df):

    plt.figure(figsize=(15, 6))

    plt.plot(
        results_df["year_month"],
        results_df["actual"],
        label="Actual",
    )

    plt.plot(
        results_df["year_month"],
        results_df["predicted"],
        label="Predicted",
    )

    plt.title("Actual vs Predicted Monthly Demand")

    plt.xlabel("Month")

    plt.ylabel("Demand")

    plt.legend()

    plt.grid(True)

    plt.tight_layout()

    plt.savefig(
        "output/actual_vs_predicted.png",
        dpi=300,
        bbox_inches="tight",
    )

    plt.close()

def plot_feature_importance(importance_df):

    plt.figure(figsize=(10, 8))

    plt.barh(
        importance_df["Feature"],
        importance_df["Importance"],
    )

    plt.title("Feature Importance")

    plt.xlabel("Importance")

    plt.tight_layout()

    plt.savefig("output/feature_importance.png", dpi=300, bbox_inches="tight")

    plt.close()
