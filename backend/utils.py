def compare_tree_counts(pred1_df, pred2_df):
    count_2016 = len(pred1_df)
    count_2022 = len(pred2_df)

    loss_pct = 0
    if count_2016 > 0:
        loss_pct = round((1 - (count_2022 / count_2016)) * 100, 2)

    return {
        "tree_count_2016": count_2016,
        "tree_count_2022": count_2022,
        "loss_percent": loss_pct
    }
