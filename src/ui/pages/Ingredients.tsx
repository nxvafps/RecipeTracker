import { useState, useEffect } from "react";
import styled from "styled-components";

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  user_id: number;
  created_at: string;
}

export const Ingredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    setIsLoading(true);
    try {
      const result = await window.electronAPI.ingredients.getAll();
      if (result.success && result.ingredients) {
        setIngredients(result.ingredients);
      } else {
        setError(result.message || "Failed to load ingredients");
      }
    } catch (err) {
      setError("An error occurred while loading ingredients");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.unit.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      let result;
      if (editingId) {
        result = await window.electronAPI.ingredients.update(
          editingId,
          formData.name,
          formData.unit
        );
      } else {
        result = await window.electronAPI.ingredients.add(
          formData.name,
          formData.unit
        );
      }

      if (result.success) {
        setFormData({ name: "", unit: "" });
        setIsModalOpen(false);
        setEditingId(null);
        loadIngredients();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  const handleEdit = (ingredient: Ingredient) => {
    setFormData({
      name: ingredient.name,
      unit: ingredient.unit,
    });
    setEditingId(ingredient.id);
    setIsModalOpen(true);
    setError("");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this ingredient?")) {
      return;
    }

    try {
      const result = await window.electronAPI.ingredients.delete(id);
      if (result.success) {
        loadIngredients();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An error occurred while deleting");
    }
  };

  const handleAddNew = () => {
    setFormData({ name: "", unit: "" });
    setEditingId(null);
    setError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", unit: "" });
    setEditingId(null);
    setError("");
  };

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <Title>Ingredients</Title>
        <AddButton onClick={handleAddNew}>Add Ingredient</AddButton>
      </Header>

      {!isLoading && ingredients.length > 0 && (
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
      )}

      {isLoading ? (
        <LoadingMessage>Loading ingredients...</LoadingMessage>
      ) : ingredients.length === 0 ? (
        <EmptyState>
          <EmptyText>No ingredients, add one now</EmptyText>
        </EmptyState>
      ) : filteredIngredients.length === 0 ? (
        <EmptyState>
          <EmptyText>No ingredients found matching "{searchQuery}"</EmptyText>
        </EmptyState>
      ) : (
        <IngredientsList>
          {filteredIngredients.map((ingredient) => (
            <IngredientCard key={ingredient.id}>
              <IngredientInfo>
                <IngredientName>{ingredient.name}</IngredientName>
                <IngredientUnit>{ingredient.unit}</IngredientUnit>
              </IngredientInfo>
              <ButtonGroup>
                <EditButton onClick={() => handleEdit(ingredient)}>
                  Edit
                </EditButton>
                <DeleteButton onClick={() => handleDelete(ingredient.id)}>
                  Delete
                </DeleteButton>
              </ButtonGroup>
            </IngredientCard>
          ))}
        </IngredientsList>
      )}

      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingId ? "Edit Ingredient" : "Add Ingredient"}
              </ModalTitle>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              {error && <ErrorMessage>{error}</ErrorMessage>}

              <FormGroup>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Flour, Sugar, Milk"
                  autoFocus
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  type="text"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  placeholder="e.g., grams, ml, whole item"
                />
              </FormGroup>

              <ModalButtonGroup>
                <CancelButton type="button" onClick={handleCloseModal}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  {editingId ? "Update" : "Add"}
                </SubmitButton>
              </ModalButtonGroup>
            </Form>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

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

const LoadingMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 3rem;
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

const IngredientsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const IngredientCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 179, 217, 0.15);
  }
`;

const IngredientInfo = styled.div`
  flex: 1;
`;

const IngredientName = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const IngredientUnit = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
`;

const EditButton = styled.button`
  flex: 1;
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
  flex: 1;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
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
  box-sizing: border-box; // Add this line

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

const ModalButtonGroup = styled.div`
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
`;
