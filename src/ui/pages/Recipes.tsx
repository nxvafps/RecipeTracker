import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import type { Recipe, RecipeFormData, Ingredient } from "../types/recipe";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.active};
  }

  &:active {
    transform: translateY(0);
  }
`;

const SearchBar = styled.div`
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const RecipesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RecipeCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 179, 217, 0.15);
  }
`;

const RecipeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const RecipeContent = styled.div`
  flex: 1;
`;

const RecipeTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const RecipeInfo = styled.div`
  display: flex;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const ShoppingListButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 1rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.active};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.buttonBg};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.buttonBg};
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #ff6b6b;
    color: white;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 2px dashed ${({ theme }) => theme.colors.border};
`;

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.2rem;
  margin: 0;
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 2rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.buttonBg};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Form = styled.form`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  transition: all 0.2s;
  box-sizing: border-box;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const ErrorMessage = styled.div`
  padding: 0.75rem;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid #ff6b6b;
  border-radius: 6px;
  color: #ff6b6b;
  font-size: 0.875rem;
`;

const IngredientsSection = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background};
`;

const IngredientRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const InstructionsSection = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background};
`;

const InstructionRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const StepNumber = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  flex-shrink: 0;
  margin-top: 0.75rem;
`;

const RemoveButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
  }
`;

const AddMoreButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.buttonBg};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Recipes = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedRecipes, setSelectedRecipes] = useState<Set<number>>(
    new Set()
  );
  const [isAddingToShoppingList, setIsAddingToShoppingList] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Ingredient modal state
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [ingredientFormData, setIngredientFormData] = useState({
    name: "",
    unit: "",
  });
  const [ingredientError, setIngredientError] = useState("");

  const [formData, setFormData] = useState<RecipeFormData>({
    name: "",
    servings: "",
    timeNeeded: "",
    ingredients: [{ ingredientId: 0, quantity: "" }],
    instructions: [""],
  });

  useEffect(() => {
    loadRecipes();
    loadIngredients();
  }, []);

  // Handle edit parameter from URL (when navigating from RecipeDetail)
  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId && recipes.length > 0) {
      handleEdit(parseInt(editId));
      // Remove the edit parameter from URL after handling
      navigate("/recipes", { replace: true });
    }
  }, [searchParams, recipes, navigate]);

  const loadRecipes = async () => {
    setIsLoading(true);
    try {
      const result = await window.electronAPI.recipes.getAll();
      if (result.success && result.recipes) {
        setRecipes(result.recipes);
      } else {
        setError(result.message || "Failed to load recipes");
      }
    } catch (err) {
      setError("An error occurred while loading recipes");
    } finally {
      setIsLoading(false);
    }
  };

  const loadIngredients = async () => {
    try {
      const result = await window.electronAPI.ingredients.getAll();
      if (result.success && result.ingredients) {
        setIngredients(result.ingredients);
      }
    } catch (err) {
      console.error("Failed to load ingredients:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      servings: "",
      timeNeeded: "",
      ingredients: [{ ingredientId: 0, quantity: "" }],
      instructions: [""],
    });
    setEditingId(null);
    setError("");
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = async (id: number) => {
    try {
      const result = await window.electronAPI.recipes.getById(id);
      if (result.success && result.recipe) {
        const recipe = result.recipe;
        setFormData({
          name: recipe.name,
          servings: recipe.servings.toString(),
          timeNeeded: recipe.time_needed.toString(),
          ingredients: recipe.ingredients.map((ing) => ({
            ingredientId: ing.ingredient_id,
            quantity: ing.quantity,
            ingredientName: ing.ingredient_name,
          })),
          instructions: recipe.instructions.map((inst) => inst.instruction),
        });
        setEditingId(id);
        setIsModalOpen(true);
      }
    } catch (err) {
      setError("Failed to load recipe for editing");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    try {
      const result = await window.electronAPI.recipes.delete(id);
      if (result.success) {
        await loadRecipes();
      } else {
        setError(result.message || "Failed to delete recipe");
      }
    } catch (err) {
      setError("An error occurred while deleting recipe");
    }
  };

  const handleRecipeCheckboxChange = (recipeId: number, checked: boolean) => {
    const newSelected = new Set(selectedRecipes);
    if (checked) {
      newSelected.add(recipeId);
    } else {
      newSelected.delete(recipeId);
    }
    setSelectedRecipes(newSelected);
  };

  const handleAddToShoppingList = async () => {
    if (selectedRecipes.size === 0) return;

    setIsAddingToShoppingList(true);
    try {
      // Fetch full recipe details for all selected recipes
      const selectedRecipeDetails = await Promise.all(
        Array.from(selectedRecipes).map((id) =>
          window.electronAPI.recipes.getById(id)
        )
      );

      // Collect all ingredients from selected recipes
      const itemsToAdd: Array<{
        ingredientId?: number;
        ingredientName: string;
        ingredientUnit: string;
        quantity: string;
      }> = [];

      selectedRecipeDetails.forEach((result) => {
        if (result.success && result.recipe) {
          result.recipe.ingredients.forEach((ing) => {
            itemsToAdd.push({
              ingredientId: ing.ingredient_id,
              ingredientName: ing.ingredient_name || "",
              ingredientUnit: ing.ingredient_unit || "",
              quantity: ing.quantity,
            });
          });
        }
      });

      // Add items to shopping list (backend will handle combining duplicates)
      const addResult = await window.electronAPI.shoppingList.addItems(
        itemsToAdd
      );

      if (addResult.success) {
        // Clear selection after successful add
        setSelectedRecipes(new Set());
        alert(
          `Successfully added ingredients from ${selectedRecipes.size} recipe(s) to shopping list!`
        );
      } else {
        alert(addResult.message || "Failed to add items to shopping list");
      }
    } catch (err) {
      console.error("Error adding to shopping list:", err);
      alert("An error occurred while adding to shopping list");
    } finally {
      setIsAddingToShoppingList(false);
    }
  };

  const handleExportRecipes = async () => {
    if (selectedRecipes.size === 0) return;

    setIsExporting(true);
    try {
      const result = await window.electronAPI.recipes.export(
        Array.from(selectedRecipes)
      );

      if (result.success) {
        alert(`${result.message}\nSaved to: ${result.filename}`);
        // Clear selection after successful export
        setSelectedRecipes(new Set());
      } else {
        alert(result.message || "Failed to export recipes");
      }
    } catch (err) {
      console.error("Error exporting recipes:", err);
      alert("An error occurred while exporting recipes");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportRecipes = async () => {
    setIsImporting(true);
    try {
      const result = await window.electronAPI.recipes.import();

      if (result.success) {
        alert(result.message);
        // Reload recipes after import
        await loadRecipes();
      } else if (result.message !== "Import cancelled") {
        alert(result.message || "Failed to import recipes");
      }
    } catch (err) {
      console.error("Error importing recipes:", err);
      alert("An error occurred while importing recipes");
    } finally {
      setIsImporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validation
    if (!formData.name.trim()) {
      setError("Recipe name is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.servings || parseInt(formData.servings) <= 0) {
      setError("Valid number of servings is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.timeNeeded || parseInt(formData.timeNeeded) <= 0) {
      setError("Valid time needed is required");
      setIsSubmitting(false);
      return;
    }

    if (
      formData.ingredients.some(
        (ing) => ing.ingredientId === 0 || !ing.quantity.trim()
      )
    ) {
      setError("All ingredients must have a selection and quantity");
      setIsSubmitting(false);
      return;
    }

    if (formData.instructions.some((inst) => !inst.trim())) {
      setError("All instruction steps must be filled out");
      setIsSubmitting(false);
      return;
    }

    const recipeData = {
      name: formData.name.trim(),
      servings: parseInt(formData.servings),
      timeNeeded: parseInt(formData.timeNeeded),
      ingredients: formData.ingredients.map((ing) => ({
        ingredientId: ing.ingredientId,
        quantity: ing.quantity.trim(),
      })),
      instructions: formData.instructions.map((inst) => inst.trim()),
    };

    try {
      const result = editingId
        ? await window.electronAPI.recipes.update(editingId, recipeData)
        : await window.electronAPI.recipes.add(recipeData);

      if (result.success) {
        closeModal();
        await loadRecipes();
      } else {
        setError(
          result.message ||
            `Failed to ${editingId ? "update" : "create"} recipe`
        );
      }
    } catch (err) {
      setError(
        `An error occurred while ${editingId ? "updating" : "creating"} recipe`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { ingredientId: 0, quantity: "" }],
    });
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      setFormData({
        ...formData,
        ingredients: formData.ingredients.filter((_, i) => i !== index),
      });
    }
  };

  const updateIngredient = (
    index: number,
    field: "ingredientId" | "quantity",
    value: string
  ) => {
    const updatedIngredients = formData.ingredients.map((ing, i) =>
      i === index
        ? {
            ...ing,
            [field]: field === "ingredientId" ? parseInt(value) : value,
          }
        : ing
    );
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ""],
    });
  };

  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      setFormData({
        ...formData,
        instructions: formData.instructions.filter((_, i) => i !== index),
      });
    }
  };

  const updateInstruction = (index: number, value: string) => {
    const updatedInstructions = formData.instructions.map((inst, i) =>
      i === index ? value : inst
    );
    setFormData({ ...formData, instructions: updatedInstructions });
  };

  const handleRecipeClick = (id: number) => {
    navigate(`/recipe/${id}`);
  };

  const openIngredientModal = () => {
    setIngredientFormData({ name: "", unit: "" });
    setIngredientError("");
    setIsIngredientModalOpen(true);
  };

  const closeIngredientModal = () => {
    setIsIngredientModalOpen(false);
    setIngredientFormData({ name: "", unit: "" });
    setIngredientError("");
  };

  const handleIngredientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIngredientError("");

    if (!ingredientFormData.name.trim() || !ingredientFormData.unit.trim()) {
      setIngredientError("Please fill in all fields");
      return;
    }

    try {
      const result = await window.electronAPI.ingredients.add(
        ingredientFormData.name,
        ingredientFormData.unit
      );

      if (result.success) {
        closeIngredientModal();
        await loadIngredients();
        // Optionally, pre-select the newly added ingredient
        if (result.ingredient) {
          setFormData({
            ...formData,
            ingredients: formData.ingredients.map((ing, idx) =>
              idx === formData.ingredients.length - 1 && ing.ingredientId === 0
                ? { ...ing, ingredientId: result.ingredient!.id }
                : ing
            ),
          });
        }
      } else {
        setIngredientError(result.message);
      }
    } catch (err) {
      setIngredientError("An error occurred while adding ingredient");
    }
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Container>
        <LoadingState>Loading recipes...</LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Recipes</Title>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {selectedRecipes.size > 0 && (
            <>
              <ShoppingListButton
                onClick={handleAddToShoppingList}
                disabled={isAddingToShoppingList}
              >
                {isAddingToShoppingList
                  ? "Adding..."
                  : `Add ${selectedRecipes.size} Recipe${
                      selectedRecipes.size > 1 ? "s" : ""
                    } to Shopping List`}
              </ShoppingListButton>
              <ShoppingListButton
                onClick={handleExportRecipes}
                disabled={isExporting}
              >
                {isExporting
                  ? "Exporting..."
                  : `Export ${selectedRecipes.size} Recipe${
                      selectedRecipes.size > 1 ? "s" : ""
                    }`}
              </ShoppingListButton>
            </>
          )}
          <ShoppingListButton
            onClick={handleImportRecipes}
            disabled={isImporting}
          >
            {isImporting ? "Importing..." : "Import Recipes"}
          </ShoppingListButton>
          <AddButton onClick={openModal}>Add Recipe</AddButton>
        </div>
      </Header>

      {!isLoading && recipes.length > 0 && (
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
      )}

      {recipes.length === 0 ? (
        <EmptyState>
          <EmptyText>No recipes, add one now</EmptyText>
        </EmptyState>
      ) : filteredRecipes.length === 0 ? (
        <EmptyState>
          <EmptyText>No recipes found matching "{searchQuery}"</EmptyText>
        </EmptyState>
      ) : (
        <RecipesList>
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              onClick={() => handleRecipeClick(recipe.id)}
            >
              <RecipeHeader>
                <RecipeContent>
                  <RecipeTitle>{recipe.name}</RecipeTitle>
                  <RecipeInfo>
                    <InfoItem>
                      🍽️ {recipe.servings} serving
                      {recipe.servings !== 1 ? "s" : ""}
                    </InfoItem>
                    <InfoItem>⏱️ {recipe.time_needed} min</InfoItem>
                  </RecipeInfo>
                </RecipeContent>
                <CheckboxWrapper>
                  <Checkbox
                    type="checkbox"
                    checked={selectedRecipes.has(recipe.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleRecipeCheckboxChange(recipe.id, e.target.checked);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </CheckboxWrapper>
              </RecipeHeader>
              <ButtonGroup>
                <EditButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(recipe.id);
                  }}
                >
                  Edit
                </EditButton>
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(recipe.id);
                  }}
                >
                  Delete
                </DeleteButton>
              </ButtonGroup>
            </RecipeCard>
          ))}
        </RecipesList>
      )}

      {/* Add/Edit Recipe Modal */}
      <Modal isOpen={isModalOpen} onClick={closeModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              {editingId ? "Edit Recipe" : "Add New Recipe"}
            </ModalTitle>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
          </ModalHeader>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Recipe Name</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter recipe name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Servings</Label>
              <Input
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) =>
                  setFormData({ ...formData, servings: e.target.value })
                }
                placeholder="Number of servings"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Time Needed (minutes)</Label>
              <Input
                type="number"
                min="1"
                value={formData.timeNeeded}
                onChange={(e) =>
                  setFormData({ ...formData, timeNeeded: e.target.value })
                }
                placeholder="Cooking time in minutes"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Ingredients</Label>
              <IngredientsSection>
                {formData.ingredients.map((ingredient, index) => (
                  <IngredientRow key={index}>
                    <Select
                      value={ingredient.ingredientId}
                      onChange={(e) =>
                        updateIngredient(index, "ingredientId", e.target.value)
                      }
                      required
                      style={{ flex: 1 }}
                    >
                      <option value={0}>Select ingredient...</option>
                      {ingredients.map((ing) => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name} ({ing.unit})
                        </option>
                      ))}
                    </Select>
                    <Input
                      type="text"
                      value={ingredient.quantity}
                      onChange={(e) =>
                        updateIngredient(index, "quantity", e.target.value)
                      }
                      placeholder="Quantity"
                      required
                      style={{ flex: "0 0 120px" }}
                    />
                    {formData.ingredients.length > 1 && (
                      <RemoveButton
                        type="button"
                        onClick={() => removeIngredient(index)}
                      >
                        Remove
                      </RemoveButton>
                    )}
                  </IngredientRow>
                ))}
                <AddMoreButton type="button" onClick={addIngredient}>
                  Add Ingredient
                </AddMoreButton>
                <AddMoreButton
                  type="button"
                  onClick={openIngredientModal}
                  style={{ background: "#10b981", marginLeft: "0.5rem" }}
                >
                  Create New Ingredient
                </AddMoreButton>
              </IngredientsSection>
            </FormGroup>

            <FormGroup>
              <Label>Instructions</Label>
              <InstructionsSection>
                {formData.instructions.map((instruction, index) => (
                  <InstructionRow key={index}>
                    <StepNumber>{index + 1}</StepNumber>
                    <TextArea
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      placeholder={`Step ${index + 1} instructions...`}
                      required
                      style={{ flex: 1 }}
                    />
                    {formData.instructions.length > 1 && (
                      <RemoveButton
                        type="button"
                        onClick={() => removeInstruction(index)}
                      >
                        Remove
                      </RemoveButton>
                    )}
                  </InstructionRow>
                ))}
                <AddMoreButton type="button" onClick={addInstruction}>
                  Add Step
                </AddMoreButton>
              </InstructionsSection>
            </FormGroup>

            <FormActions>
              <CancelButton type="button" onClick={closeModal}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : editingId
                  ? "Update Recipe"
                  : "Create Recipe"}
              </SubmitButton>
            </FormActions>
          </Form>
        </ModalContent>
      </Modal>

      {/* Add Ingredient Modal */}
      <Modal isOpen={isIngredientModalOpen} onClick={closeIngredientModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Add New Ingredient</ModalTitle>
            <CloseButton onClick={closeIngredientModal}>&times;</CloseButton>
          </ModalHeader>

          {ingredientError && <ErrorMessage>{ingredientError}</ErrorMessage>}

          <Form onSubmit={handleIngredientSubmit}>
            <FormGroup>
              <Label htmlFor="ingredient-name">Name</Label>
              <Input
                id="ingredient-name"
                type="text"
                value={ingredientFormData.name}
                onChange={(e) =>
                  setIngredientFormData({
                    ...ingredientFormData,
                    name: e.target.value,
                  })
                }
                placeholder="e.g., Flour, Sugar, Milk"
                autoFocus
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="ingredient-unit">Unit</Label>
              <Input
                id="ingredient-unit"
                type="text"
                value={ingredientFormData.unit}
                onChange={(e) =>
                  setIngredientFormData({
                    ...ingredientFormData,
                    unit: e.target.value,
                  })
                }
                placeholder="e.g., grams, ml, whole item"
              />
            </FormGroup>

            <FormActions>
              <CancelButton type="button" onClick={closeIngredientModal}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit">Add Ingredient</SubmitButton>
            </FormActions>
          </Form>
        </ModalContent>
      </Modal>
    </Container>
  );
};
