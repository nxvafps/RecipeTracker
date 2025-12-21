import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import type { FullRecipe } from "../types/recipe";

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: none;
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 0.5rem;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.surface};
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
`;

const RecipeInfo = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const InfoCard = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  flex: 1;
`;

const InfoLabel = styled.div`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const InfoValue = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: bold;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 1.5rem 0;
  font-size: 1.75rem;
  border-bottom: 3px solid ${(props) => props.theme.colors.primary};
  padding-bottom: 0.5rem;
`;

const IngredientsGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const IngredientItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: ${(props) => props.theme.colors.surface};
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const QuantityBadge = styled.div`
  background: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: bold;
  margin-right: 1rem;
  white-space: nowrap;
`;

const IngredientInfo = styled.div`
  flex: 1;
`;

const IngredientName = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 1.1rem;
`;

const IngredientUnit = styled.div`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const InstructionsList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: step-counter;
`;

const InstructionItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  counter-increment: step-counter;

  &::before {
    content: counter(step-counter);
    background: ${(props) => props.theme.colors.primary};
    color: white;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 1rem;
    flex-shrink: 0;
  }
`;

const InstructionText = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.25rem;
  color: ${(props) => props.theme.colors.text};
  line-height: 1.6;
  flex: 1;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #ef4444;
  background: ${(props) => props.theme.colors.surface};
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const ActionButton = styled.button<{
  variant?: "primary" | "secondary" | "danger";
}>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) => {
    switch (props.variant) {
      case "primary":
        return `
          background: ${props.theme.colors.primary};
          color: white;
          &:hover {
            background: ${props.theme.colors.primaryHover};
          }
        `;
      case "danger":
        return `
          background: #ef4444;
          color: white;
          &:hover {
            background: #dc2626;
          }
        `;
      default:
        return `
          background: ${props.theme.colors.surface};
          color: ${props.theme.colors.text};
          border: 2px solid ${props.theme.colors.border};
          &:hover {
            background: ${props.theme.colors.border};
          }
        `;
    }
  }}
`;

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<FullRecipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadRecipe(parseInt(id));
    }
  }, [id]);

  const loadRecipe = async (recipeId: number) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await window.electronAPI.recipes.getById(recipeId);

      if (result.success && result.recipe) {
        setRecipe(result.recipe);
      } else {
        setError(result.message || "Failed to load recipe");
      }
    } catch (err) {
      setError("An error occurred while loading the recipe");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/recipes");
  };

  const handleEdit = () => {
    if (recipe) {
      // Navigate back to recipes page with edit parameter
      navigate(`/recipes?edit=${recipe.id}`);
    }
  };

  const handleDelete = async () => {
    if (!recipe) return;

    if (!confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      return;
    }

    try {
      const result = await window.electronAPI.recipes.delete(recipe.id);

      if (result.success) {
        navigate("/recipes");
      } else {
        setError(result.message || "Failed to delete recipe");
      }
    } catch (err) {
      setError("An error occurred while deleting the recipe");
    }
  };

  if (isLoading) {
    return (
      <Container>
        <BackButton onClick={handleBack}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Recipes
        </BackButton>
        <LoadingState>Loading recipe...</LoadingState>
      </Container>
    );
  }

  if (error || !recipe) {
    return (
      <Container>
        <BackButton onClick={handleBack}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Recipes
        </BackButton>
        <ErrorState>{error || "Recipe not found"}</ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={handleBack}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Recipes
      </BackButton>

      <Header>
        <Title>{recipe.name}</Title>
        <RecipeInfo>
          <InfoCard>
            <InfoLabel>Servings</InfoLabel>
            <InfoValue>{recipe.servings}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>Cook Time</InfoLabel>
            <InfoValue>{recipe.time_needed} min</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>Created</InfoLabel>
            <InfoValue>
              {new Date(recipe.created_at).toLocaleDateString()}
            </InfoValue>
          </InfoCard>
        </RecipeInfo>
      </Header>

      <Section>
        <SectionTitle>Ingredients</SectionTitle>
        <IngredientsGrid>
          {recipe.ingredients.map((ingredient) => (
            <IngredientItem key={ingredient.id}>
              <QuantityBadge>{ingredient.quantity}</QuantityBadge>
              <IngredientInfo>
                <IngredientName>
                  {ingredient.ingredient_name ||
                    `Ingredient ${ingredient.ingredient_id}`}
                </IngredientName>
                <IngredientUnit>
                  {ingredient.ingredient_unit || "unit"}
                </IngredientUnit>
              </IngredientInfo>
            </IngredientItem>
          ))}
        </IngredientsGrid>
      </Section>

      <Section>
        <SectionTitle>Instructions</SectionTitle>
        <InstructionsList>
          {recipe.instructions
            .sort((a, b) => a.step_number - b.step_number)
            .map((instruction) => (
              <InstructionItem key={instruction.id}>
                <InstructionText>{instruction.instruction}</InstructionText>
              </InstructionItem>
            ))}
        </InstructionsList>
      </Section>

      <ActionButtons>
        <ActionButton variant="primary" onClick={handleEdit}>
          Edit Recipe
        </ActionButton>
        <ActionButton variant="danger" onClick={handleDelete}>
          Delete Recipe
        </ActionButton>
      </ActionButtons>
    </Container>
  );
};

export default RecipeDetail;
